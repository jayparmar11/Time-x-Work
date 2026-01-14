import type { StateStorage } from 'zustand/middleware'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { decryptData, encryptData } from '../lib/crypto'

export interface SubTask {
  id: string // crypto.randomUUID()
  title: string
}

export interface Duration {
  hours: number
  minutes: number
}

export interface Task {
  id: string
  title: string
  startTime: number | null // Timestamp
  endTime: number | null // Timestamp
  duration: Duration | null // NULL = Active, OBJECT = Completed
  subTasks: SubTask[]
  date: string // YYYY-MM-DD
}

interface TaskState {
  tasks: Task[]
  isLocked: boolean
  isLoading: boolean

  // Actions
  unlockVault: (password: string) => Promise<boolean>
  lockVault: () => void
  addTask: (title: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addSubTask: (taskId: string, title: string) => void
  deleteSubTask: (taskId: string, subTaskId: string) => void
  setTasks: (tasks: Task[]) => void
  autoCorrectHistory: () => void
}

let sessionPassword: string | null = null

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name)
    if (!value)
      return null
    if (!sessionPassword)
      return null // Cannot decrypt without password
    try {
      return await decryptData(value, sessionPassword)
    }
    catch (e) {
      console.error('Failed to decrypt', e)
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!sessionPassword)
      return // Cannot encrypt without password
    const encrypted = await encryptData(value, sessionPassword)
    localStorage.setItem(name, encrypted)
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLocked: true,
      isLoading: false,

      unlockVault: async (password: string) => {
        sessionPassword = password
        // Try to read from storage to verify password if data exists
        const stored = localStorage.getItem('v2-vault-storage')
        if (stored) {
          try {
            // Determine if we can decrypt
            await decryptData(stored, password)

            // If successful, rehydrate the store
            await useTaskStore.persist.rehydrate()

            set({ isLocked: false })
            return true
          }
          catch (e) {
            sessionPassword = null
            return false
          }
        }
        else {
          // No data implies new user or empty. Set password and unlock.
          set({ isLocked: false })
          return true
        }
      },

      lockVault: () => {
        sessionPassword = null
        set({ isLocked: true, tasks: [] }) // Clear tasks from memory for security
      },

      setTasks: tasks => set({ tasks }),

      addTask: (title: string) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          startTime: Date.now(),
          endTime: null,
          duration: null,
          subTasks: [],
          date: new Date().toISOString().split('T')[0],
        }
        set(state => ({ tasks: [newTask, ...state.tasks] }))
      },

      deleteTask: id => set(state => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      updateTask: (id, updates) => set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      })),

      addSubTask: (taskId, title) => set(state => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId)
            return t
          return {
            ...t,
            subTasks: [...t.subTasks, { id: crypto.randomUUID(), title }],
          }
        }),
      })),

      deleteSubTask: (taskId, subTaskId) => set(state => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId)
            return t
          return {
            ...t,
            subTasks: t.subTasks.filter(st => st.id !== subTaskId),
          }
        }),
      })),

      autoCorrectHistory: () => {
        const today = new Date().toISOString().split('T')[0]
        set(state => ({
          tasks: state.tasks.map((t) => {
            // If task is not from today AND has no duration, default to 1h
            if (t.date !== today && t.duration === null) {
              return {
                ...t,
                duration: { hours: 1, minutes: 0 },
                // Estimate end time based on start or now (though start+1h is safer)
                endTime: t.startTime ? t.startTime + 3600000 : Date.now(),
              }
            }
            return t
          }),
        }))
      },
    }),
    {
      name: 'v2-vault-storage',
      storage: createJSONStorage(() => storage),
      skipHydration: true,
      partialize: state => ({ tasks: state.tasks }),
    },
  ),
)
