import { useState } from 'preact/hooks'
import { cn } from '../../lib/utils'
import { useTaskActions, useTaskStore } from '../../store/useTaskStore'

export function LockScreen() {
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const { unlockVault } = useTaskActions()
  const isLoading = useTaskStore(state => state.isLoading)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!password)
      return

    const success = await unlockVault(password)
    if (!success) {
      setIsError(true)
      // Remove error class after animation completes to allow re-trigger
      setTimeout(() => setIsError(false), 500)
    }
    else {
      setPassword('')
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-base-300 text-base-content">
      <div className="w-full max-w-xs space-y-4 p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Security Vault</h1>
        <p className="text-sm opacity-70">Enter your password to decrypt the workspace.</p>

        <form onSubmit={handleSubmit} className="form-control w-full">
          <input
            type="password"
            placeholder="Passphrase code..."
            className={cn(
              'input input-bordered w-full text-center transition-all',
              isError && 'input-error animate-shake',
            )}
            value={password}
            onInput={e => setPassword(e.currentTarget.value)}
          />
          <button
            type="submit"
            className="btn btn-primary mt-4 w-full"
            disabled={isLoading}
          >
            Unlock Access
          </button>
        </form>
      </div>
    </div>
  )
}
