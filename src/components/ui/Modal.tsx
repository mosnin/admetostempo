'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
  showClose?: boolean
}

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showClose = true,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount>
                <motion.div
                  className={cn(
                    'fixed z-50 bg-white/90 backdrop-blur-[16px]',
                    'border border-[rgba(196,181,253,0.2)]',
                    'shadow-[0_16px_48px_rgba(196,181,253,0.3)]',
                    // Mobile: slide up from bottom
                    'bottom-0 left-0 right-0 rounded-t-3xl px-5 py-6',
                    // Desktop: centered dialog
                    'sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
                    'sm:w-full sm:max-w-lg sm:rounded-3xl',
                    className
                  )}
                  initial={{
                    y: '100%',
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: '100%',
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                  }}
                  style={{
                    // Desktop override for the y-animation
                  }}
                >
                  {showClose && (
                    <Dialog.Close className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed] transition-colors hover:bg-[#ddd6fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5fd]">
                      <X size={16} />
                    </Dialog.Close>
                  )}

                  {title && (
                    <Dialog.Title className="mb-1 text-lg font-bold text-[#1e1b4b] pr-8">
                      {title}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="mb-4 text-sm text-[#6b7280]">
                      {description}
                    </Dialog.Description>
                  )}

                  {children}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Convenience trigger wrapper
const ModalTrigger = Dialog.Trigger

export { Modal, ModalTrigger }
