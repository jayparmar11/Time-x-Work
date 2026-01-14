import { useEffect } from 'preact/hooks'
import Clock from './components/clock-css-only/Clock'
import { HistorySection } from './components/sections/History.tsx'
import { WorkspaceSection } from './components/sections/Workspace.tsx'
import { LockScreen } from './components/ui/LockScreen'

import { useKillSwitch } from './hooks/useKillSwitch'

import { useTaskStore } from './store/useTaskStore'
import './global.css'
// Placeholder sections - will be moved to separate files in Phase 4 & 5
// Workspace placeholder removed
// History placeholder removed

export function App() {
  const isLocked = useTaskStore(state => state.isLocked)
  const autoCorrectHistory = useTaskStore(state => state.autoCorrectHistory)

  // Initialize kill switch
  useKillSwitch()

  // Auto-correct history on unlock
  useEffect(() => {
    if (!isLocked) {
      autoCorrectHistory()
    }
  }, [isLocked, autoCorrectHistory])

  if (isLocked) {
    // return <LockScreen />; // Removed early return
  }

  return (
    <div className={`${isLocked ? 'h-[200vh]' : 'h-[300vh]'} w-full bg-base-100 text-base-content relative transition-all duration-300`}>
      {/* Section 1: Clock */}
      <div className="h-screen w-full flex items-center justify-center sticky top-0 bg-base-100 z-0">
        <div className="scale-150">
          <Clock />
        </div>
      </div>

      {/* Section 2: Workspace or Lock Screen */}
      <div className="h-screen w-full relative z-10 bg-base-300 snap-start shadow-xl">
        {isLocked ? <LockScreen /> : <WorkspaceSection />}
      </div>

      {/* Section 3: History (Only if unlocked) */}
      {!isLocked && (
        <div className="h-screen w-full relative z-10 bg-base-200 snap-start">
          <HistorySection />
        </div>
      )}
    </div>
  )
}
