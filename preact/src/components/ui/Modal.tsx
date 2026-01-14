import { X } from 'lucide-preact'
import { createPortal } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: preact.ComponentChildren
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog)
      return

    if (isOpen) {
      if (!dialog.open)
        dialog.showModal()
    }
    else {
      if (dialog.open)
        dialog.close()
    }
  }, [isOpen])

  if (!isOpen)
    return null

  return createPortal(
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle backdrop-blur-md" onClose={onClose}>
      <div className="modal-box p-6 relative bg-base-300 border border-zinc-700">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg pr-8 truncate">{title}</h3>
        <div className="mt-4">
          {children}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>,
    document.body,
  )
}
