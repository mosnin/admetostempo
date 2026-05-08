'use client'

import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { CHAINS, CHAIN_MAP, type ChainId } from './ChainIcon'

interface ChainSelectorProps {
  value: ChainId
  onChange: (value: ChainId) => void
  label?: string
  excludeChain?: ChainId
}

export function ChainSelector({ value, onChange, label, excludeChain }: ChainSelectorProps) {
  const availableChains = excludeChain ? CHAINS.filter((c) => c.id !== excludeChain) : CHAINS
  const selected = CHAIN_MAP[value]

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
          {label}
        </label>
      )}
      <Select.Root value={value} onValueChange={(v) => onChange(v as ChainId)}>
        <Select.Trigger
          className="
            flex items-center justify-between gap-2
            px-4 py-3 rounded-2xl
            bg-white/70 backdrop-blur-sm
            border border-[rgba(196,181,253,0.3)]
            shadow-[0_2px_8px_rgba(196,181,253,0.15)]
            hover:border-[rgba(196,181,253,0.5)] hover:bg-white/80
            focus:outline-none focus:ring-2 focus:ring-lavender-300
            transition-all duration-200 cursor-pointer
            min-w-[160px]
          "
        >
          <Select.Value asChild>
            <span className="flex items-center gap-2">
              <span className="text-xl">{selected?.logo}</span>
              <span className="font-semibold text-gray-800 text-sm">{selected?.name}</span>
            </span>
          </Select.Value>
          <Select.Icon>
            <ChevronDown size={16} className="text-lavender-400" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="
              z-50 overflow-hidden
              rounded-2xl
              bg-white/95 backdrop-blur-xl
              border border-[rgba(196,181,253,0.3)]
              shadow-[0_8px_32px_rgba(196,181,253,0.3)]
              animate-slide-up
            "
            position="popper"
            sideOffset={6}
          >
            <Select.Viewport className="p-2">
              {availableChains.map((chain) => (
                <Select.Item
                  key={chain.id}
                  value={chain.id}
                  className="
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm text-gray-700 font-medium
                    cursor-pointer outline-none
                    hover:bg-lavender-50 hover:text-lavender-700
                    data-[highlighted]:bg-lavender-50 data-[highlighted]:text-lavender-700
                    transition-colors duration-100
                  "
                >
                  <span className="text-lg">{chain.logo}</span>
                  <Select.ItemText>{chain.name}</Select.ItemText>
                  <Select.ItemIndicator className="ml-auto">
                    <Check size={14} className="text-lavender-500" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
