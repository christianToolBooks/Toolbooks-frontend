"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  itemName?: string
  isDeleting?: boolean
  confirmText?: string
  cancelText?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message,
  itemName,
  isDeleting = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-start p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>{message}</p>

                    {itemName && (
                      <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-red-500">
                        <p className="font-medium text-gray-900">
                          delete: <span className="text-red-600">{itemName}</span>
                        </p>
                      </div>
                    )}

                    <p className="text-red-600 font-medium">⚠️ This action cannot be undone.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isDeleting} className="rounded-md">
                      {cancelText}
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} className="rounded-md">
                      {isDeleting ? "Deleting..." : confirmText}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
