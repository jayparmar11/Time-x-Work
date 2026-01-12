import { useEffect } from 'preact/hooks'
import Clock from './components/clock-css-only/Clock'
import { HistorySection } from './components/sections/History.tsx'
import { WorkspaceSection } from './components/sections/Workspace.tsx'
import { LockScreen } from './components/ui/LockScreen'
import { useKillSwitch } from './hooks/useKillSwitch'
import { cn } from './lib/utils.ts'
import { useTaskActions, useTaskStore } from './store/useTaskStore'
import './global.css'

export function App() {
  const isLocked = useTaskStore(state => state.isLocked)
  const { autoCorrectHistory } = useTaskActions()

  useKillSwitch()

  useEffect(() => {
    if (!isLocked) {
      autoCorrectHistory()
    }
  }, [isLocked, autoCorrectHistory])

  return (
    <div className={
      cn(isLocked
        ? 'h-[200vh]'
        : 'h-[300vh]', ` w-full bg-base-100 text-base-content relative transition-all duration-300`)
    }
    >
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
