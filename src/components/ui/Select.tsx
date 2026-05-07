'use client'

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

function Select({
  value,
  onValueChange,
  placeholder = 'Select…',
  options,
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-sm font-medium text-[#1e1b4b]">{label}</span>}
      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <RadixSelect.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-xl border bg-white/80 px-4 py-2.5',
            'text-sm text-[#1e1b4b] outline-none transition-all duration-200',
            'border-[#e8e4fd] focus:border-[#c4b5fd] focus:ring-2 focus:ring-[#c4b5fd]/30',
            'data-[placeholder]:text-[#9ca3af]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[#fb7185] focus:border-[#fb7185] focus:ring-[#fb7185]/30'
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon asChild>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ChevronDown size={16} className="text-[#a78bfa]" />
            </motion.span>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-[rgba(196,181,253,0.2)] bg-white/90 backdrop-blur-[16px] shadow-[0_8px_24px_rgba(196,181,253,0.3)] p-1"
            >
              <RadixSelect.Viewport>
                {options.map((opt) => (
                  <RadixSelect.Item
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-[#1e1b4b]',
                      'outline-none transition-colors',
                      'hover:bg-[#ede9fe] data-[highlighted]:bg-[#ede9fe]',
                      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
                    )}
                  >
                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator>
                      <Check size={14} className="text-[#7c3aed]" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </motion.div>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-[#f43f5e] font-medium">{error}</p>}
    </div>
  )
}

export { Select }
