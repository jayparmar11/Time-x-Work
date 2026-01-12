import { Plus } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useTaskActions } from '../../store/useTaskStore'

export function TaskInput() {
  const [title, setTitle] = useState('')
  const { addTask } = useTaskActions()

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (!title.trim())
      return
    addTask(title)
    setTitle('')
  }

  return (
    <div className="sticky top-0 z-40 pt-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onInput={e => setTitle(e.currentTarget.value)}
          placeholder="What are you working on?"
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          <Plus size={20} />
          Start Work
        </button>
      </form>
    </div>
  )
}
