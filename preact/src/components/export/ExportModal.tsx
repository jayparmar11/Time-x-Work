import { Copy, FileSpreadsheet, List } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { useTaskStore } from '../../store/useTaskStore'
import { Modal } from '../ui/Modal'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  dateFilter?: string
}

export function ExportModal({ isOpen, onClose, dateFilter }: ExportModalProps) {
  const tasks = useTaskStore(state => state.tasks)
  const [format, setFormat] = useState<'table' | 'list'>('table')
  const [copied, setCopied] = useState(false)

  // Filter by date if provided
  const filteredTasks = dateFilter ? tasks.filter(t => t.date === dateFilter) : tasks

  // Sort tasks by date desc
  const sortedTasks = [...filteredTasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleCopy = () => {
    const content = document.getElementById('export-content')?.innerHTML
    if (content) {
      const type = 'text/html'
      const blob = new Blob([content], { type })
      // Use standard clipboard API if strictly plain text, but for HTML table we need ClipboardItem
      // Fallback for simple text copy if needed but HTML copy is requested.
      try {
        const data = [new ClipboardItem({ [type]: blob })]
        navigator.clipboard.write(data).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }
      catch (e) {
        console.error('Clipboard write failed', e)
        alert('Clipboard access denied or not supported')
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Tasks">
      <div className="flex gap-4 mb-4">
        <button
          className={`btn flex-1 ${format === 'table' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFormat('table')}
        >
          <FileSpreadsheet size={16} />
          {' '}
          Excel / Table
        </button>
        <button
          className={`btn flex-1 ${format === 'list' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFormat('list')}
        >
          <List size={16} />
          {' '}
          Markdown / List
        </button>
      </div>

      <div className="bg-base-200 p-4 rounded-lg overflow-auto max-h-60 mb-4 border border-base-300">
        <div id="export-content" className="prose prose-sm max-w-none bg-white p-2 text-black">
          {format === 'table'
            ? (
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-1 text-left">Task Name</th>
                      <th className="border p-1 text-left">Date</th>
                      <th className="border p-1 text-left">Start</th>
                      <th className="border p-1 text-left">End</th>
                      <th className="border p-1 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.map(task => (
                      <>
                        <tr key={task.id}>
                          <td className="border p-1 font-bold">{task.title}</td>
                          <td className="border p-1">{task.date}</td>
                          <td className="border p-1">{task.startTime ? new Date(task.startTime).toLocaleTimeString() : ''}</td>
                          <td className="border p-1">{task.endTime ? new Date(task.endTime).toLocaleTimeString() : ''}</td>
                          <td className="border p-1">{task.duration ? `${task.duration.hours}h ${task.duration.minutes}m` : ''}</td>
                        </tr>
                        {task.subTasks.map(st => (
                          <tr key={st.id}>
                            <td className="border p-1 pl-4" colSpan={5}>
                              •
                              {st.title}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              )
            : (
                <ul>
                  {sortedTasks.map(task => (
                    <li key={task.id}>
                      <strong>{task.title}</strong>
                      {' '}
                      (
                      {task.date}
                      ) -
                      {task.duration ? `${task.duration.hours}h ${task.duration.minutes}m` : 'Incomplete'}
                      {task.subTasks.length > 0 && (
                        <ul>
                          {task.subTasks.map(st => (
                            <li key={st.id}>{st.title}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
        </div>
      </div>

      <button className={`btn btn-block ${copied ? 'btn-success' : 'btn-neutral'}`} onClick={handleCopy}>
        <Copy size={16} />
        {' '}
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </Modal>
  )
}
