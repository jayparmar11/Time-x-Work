import type { Task } from '../../store/useTaskStore'
import { CheckCircle, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useTaskActions } from '../../store/useTaskStore'

export function TaskItem({ task }: { task: Task }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newSubTask, setNewSubTask] = useState('')

  const { deleteTask, addSubTask, deleteSubTask, updateTask } = useTaskActions()

  const handleComplete = () => {
    const now = Date.now()
    const start = task.startTime || now
    const diffMs = now - start
    const totalMinutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    updateTask(task.id, {
      endTime: now,
      duration: { hours, minutes },
    })
  }

  const handleAddSubTask = (e: Event) => {
    e.preventDefault()
    if (!newSubTask.trim())
      return
    addSubTask(task.id, newSubTask)
    setNewSubTask('')
  }

  // Format start time
  // const startTimeStr = task.startTime ? new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div className="card bg-zinc-800 shadow-sm border border-zinc-700">
      <div className="card-body p-2">
        <div className="flex items-center justify-between gap-4" onClick={() => setIsExpanded(!isExpanded)}>
          {/* Expand Button */}
          <button className="btn btn-ghost btn-xs btn-circle">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {task.title}
              {' '}
            </h3>
          </div>

          <div className="flex gap-2">
            <button onClick={handleComplete} className="btn btn-success btn-sm btn-square" title="Complete Task">
              <CheckCircle size={18} />
            </button>
            <button onClick={() => deleteTask(task.id)} className="btn btn-error btn-outline btn-sm btn-square" title="Delete Task">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Subtasks Accordion */}
        {isExpanded && (
          <div className="pl-2.5">
            <ul className="space-y-2 list-inside list-disc border-l-2 border-zinc-600 pl-8 flex flex-col">
              {task.subTasks.map(st => (
                <li key={st.id} className="w-full">
                  <span className="inline-flex justify-between items-center group w-fit">
                    <span>{st.title}</span>
                    <button onClick={() => deleteSubTask(task.id, st.id)} className="opacity-0 group-hover:opacity-100 btn btn-ghost btn-xs text-error transition-opacity">
                      <Trash2 size={12} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddSubTask} className="mt-2 flex gap-2 pl-6">
              <input
                type="text"
                className="input input-sm input-bordered flex-1"
                placeholder="Add subtask..."
                value={newSubTask}
                onInput={e => setNewSubTask(e.currentTarget.value)}
              />
              <button type="submit" className="btn btn-sm btn-primary">
                <Plus size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
