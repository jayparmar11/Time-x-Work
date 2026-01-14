import { useState } from 'preact/hooks'
import { ExportModal } from '../export/ExportModal'
import { HistoricalTaskList } from '../history/HistoricalTaskList'

export function HistorySection() {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportDate, setExportDate] = useState<string | undefined>(undefined)

  const handleExportDate = (date: string) => {
    setExportDate(date)
    setIsExportOpen(true)
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 h-full flex flex-col ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">History</h2>
      </div>

      <div className="overflow-y-auto custom-scrollbar">
        <HistoricalTaskList onExportDate={handleExportDate} />
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dateFilter={exportDate}
      />
    </div>
  )
}
