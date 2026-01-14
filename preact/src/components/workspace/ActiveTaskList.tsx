import { useTaskStore } from '../../store/useTaskStore'
import { TaskItem } from './TaskItem'

export function ActiveTaskList() {
  const tasks = useTaskStore(state => state.tasks)
  const today = new Date().toISOString().split('T')[0]
  // Active tasks: date === today AND duration === null
  const activeTasks = tasks.filter(t => t.date === today && t.duration === null)

  if (activeTasks.length === 0) {
    return (
      <div className="text-center opacity-50 py-10">
        <p>No active tasks. Start working!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {activeTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
