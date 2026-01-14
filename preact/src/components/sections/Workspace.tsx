import { Download } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { ExportModal } from '../export/ExportModal'
import { CompletedTaskList } from '../history/CompletedTaskList'
import { ActiveTaskList } from '../workspace/ActiveTaskList'
import { TaskInput } from '../workspace/TaskInput'

export function WorkspaceSection() {
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Workspace</h2>
        <button onClick={() => setIsExportOpen(true)} className="btn btn-sm btn-outline gap-2">
          <Download size={16} />
          {' '}
          Export
        </button>
      </div>
      <TaskInput />
      <div className="mt-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <ActiveTaskList />
        <div className="divider opacity-50 my-6">Completed</div>
        <CompletedTaskList />
      </div>
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  )
}
