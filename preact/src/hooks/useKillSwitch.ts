import { useEffect } from 'preact/hooks'
import { useTaskActions, useTaskStore } from '../store/useTaskStore'

export function useKillSwitch() {
  const { lockVault } = useTaskActions()
  const isLocked = useTaskStore(state => state.isLocked)

  useEffect(() => {
    // Only set up listeners if currently unlocked?
    // Actually, kill switch should be active always or just when unlocked?
    // If locked, it's already locked. So we only care when unlocked.
    if (isLocked)
      return

    const handleResize = () => {
      // console.log("Window resize detected. Locking vault.");
      lockVault()
    }

    window.addEventListener('resize', handleResize)

    // DevTools detection (simple debugger loop)
    // This blocks execution if devtools is open and pauses on debugger
    const devToolsCheck = setInterval(() => {
      const start = performance.now()
      // // eslint-disable-next-line no-debugger
      // debugger
      if (performance.now() - start > 100) {
        // console.log("DevTools detected. Locking vault.");
        lockVault()
      }
    }, 2000) // Check every 2 seconds to avoid too much overhead

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(devToolsCheck)
    }
  }, [isLocked, lockVault])
}
