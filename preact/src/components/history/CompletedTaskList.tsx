import type { Task } from '../../store/useTaskStore'
import { Edit2, Trash2 } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useTaskStore } from '../../store/useTaskStore'
import { TaskEditModal } from './TaskEditModal'

export function CompletedTaskList() {
  const tasks = useTaskStore(state => state.tasks)
  const deleteTask = useTaskStore(state => state.deleteTask)
  const today = new Date().toISOString().split('T')[0]

  // Completed Today: duration !== null and date === today
  const completedTasks = tasks.filter(t => t.date === today && t.duration !== null)

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  if (completedTasks.length === 0)
    return null

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4">Completed Today</h3>
      <div className="space-y-2">
        {completedTasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 transition-all">
            <div className="flex-1 min-w-0 pr-4">
              <div className="font-medium truncate">{task.title}</div>
              <div className="text-xs opacity-60">
                {task.subTasks.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-2 border-l-2 border-base-content/10">
                    {task.subTasks.map(st => (
                      <li key={st.id} className="text-sm opacity-80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-base-content opacity-50"></span>
                        {st.title}
                      </li>
                    ))}
                  </ul>
                )}
                {task.duration && (
                  <span>
                    {task.duration.hours}
                    h
                    {' '}
                    {task.duration.minutes}
                    m
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditingTask(task)} className="btn btn-ghost btn-sm btn-square">
                <Edit2 size={16} />
              </button>
              <button onClick={() => deleteTask(task.id)} className="btn btn-ghost btn-sm btn-square text-error">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </div>
  )
}
