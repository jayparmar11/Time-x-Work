import type { Task } from '../../store/useTaskStore'
import { Download } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useTaskStore } from '../../store/useTaskStore'
import { TaskEditModal } from './TaskEditModal'

interface HistoricalTaskListProps {
  onExportDate: (date: string) => void
}

export function HistoricalTaskList({ onExportDate }: HistoricalTaskListProps) {
  const tasks = useTaskStore(state => state.tasks)
  const today = new Date().toISOString().split('T')[0]

  // Historical: date !== today. Group by date.
  const historicalTasks = tasks.filter(t => t.date !== today)

  const grouped = historicalTasks.reduce((acc, task) => {
    if (!acc[task.date])
      acc[task.date] = []
    acc[task.date].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const dates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  if (dates.length === 0) {
    return (
      <div className="opacity-40 text-center py-8">
        No history yet.
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {dates.map(date => (
        <div key={date}>
          <div className="sticky top-0 bg-base-300 backdrop-blur-sm z-30 py-2 mb-2 border-b border-base-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">
              {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'long' })}
            </h3>
            <button onClick={() => onExportDate(date)} className="btn btn-ghost btn-xs opacity-50 hover:opacity-100" title="Export this day">
              <Download size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {grouped[date].map(task => (
              <div key={task.id} className="group relative pl-4 border-l-2 border-base-300 hover:border-primary transition-colors py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs opacity-60">
                      {task.subTasks.length > 0 && (
                        <ul className="mt-2 space-y-1 pl-2 border-l-2 border-base-content/10 mb-2">
                            {task.subTasks.map(st => (
                                <li key={st.id} className="text-sm opacity-80 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-base-content opacity-50"></span>
                                    {st.title}
                                </li>
                            ))}
                        </ul>
                      )}
                      {task.duration
                        ? (
                            <span>
                              {task.duration.hours}
                              h
                              {' '}
                              {task.duration.minutes}
                              m
                            </span>
                          )
                        : <span className="text-warning">Incomplete</span>}
                    </div>
                  </div>
                  <button onClick={() => setEditingTask(task)} className="opacity-0 group-hover:opacity-100 btn btn-xs btn-ghost">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </div>
  )
}
