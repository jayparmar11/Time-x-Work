import type { Task } from '../../store/useTaskStore'
import { useEffect, useState } from 'preact/hooks'
import { useTaskStore } from '../../store/useTaskStore'
import { Modal } from '../ui/Modal'

interface TaskEditModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export function TaskEditModal({ isOpen, onClose, task }: TaskEditModalProps) {
  const updateTask = useTaskStore(state => state.updateTask)

  const [title, setTitle] = useState('')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  
  const [subTasks, setSubTasks] = useState<{ id: string, title: string }[]>([])
  const [newSubTask, setNewSubTask] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setHours(task.duration?.hours || 0)
      setMinutes(task.duration?.minutes || 0)
      setSubTasks(task.subTasks || [])
    }
  }, [task])

  const handleAddSubTask = (e: Event) => {
    e.preventDefault();
    if (!newSubTask.trim()) return;
    setSubTasks([...subTasks, { id: crypto.randomUUID(), title: newSubTask }]);
    setNewSubTask('');
  }

  const handleDeleteSubTask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  }

  const handleSave = () => {
    if (!task)
      return
    updateTask(task.id, {
      title,
      duration: { hours, minutes },
      subTasks
    })
    onClose()
  }

  if (!task)
    return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="space-y-4">
        {/* Title Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Task Title</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onInput={e => setTitle(e.currentTarget.value)}
          />
        </div>

        {/* Duration Inputs */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Duration</span>
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="input-group">
                <input
                  type="number"
                  min="0"
                  className="input input-bordered w-full"
                  value={hours}
                  onInput={e => setHours(Number.parseInt(e.currentTarget.value) || 0)}
                />
                <span className="bg-base-300 px-3 flex items-center text-sm">Hrs</span>
              </label>
            </div>
            <div className="flex-1">
              <label className="input-group">
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="input input-bordered w-full"
                  value={minutes}
                  onInput={e => setMinutes(Number.parseInt(e.currentTarget.value) || 0)}
                />
                <span className="bg-base-300 px-3 flex items-center text-sm">Mins</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-control">
            <label className="label">
                <span className="label-text">Subtasks</span>
            </label>
            <ul className="space-y-2 mb-2">
                {subTasks.map(st => (
                    <li key={st.id} className="flex justify-between items-center bg-base-200 p-2 rounded">
                        <span>{st.title}</span>
                        <button onClick={() => handleDeleteSubTask(st.id)} className="btn btn-ghost btn-xs text-error">
                             ×
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    placeholder="Add subtask..."
                    value={newSubTask}
                    onInput={(e) => setNewSubTask(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubTask(e);
                        }
                    }}
                />
                <button onClick={handleAddSubTask} className="btn btn-square">
                    +
                </button>
            </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </Modal>
  )
}
