'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

export type BridgeStep = 'initiating' | 'pending' | 'confirming' | 'complete'

const STEPS: { id: BridgeStep; label: string; description: string }[] = [
  { id: 'initiating',  label: 'Initiating',  description: 'Submitting transaction to source chain' },
  { id: 'pending',     label: 'Pending',      description: 'Waiting for source chain confirmation' },
  { id: 'confirming',  label: 'Confirming',   description: 'Bridge relay in progress' },
  { id: 'complete',    label: 'Complete',     description: 'Funds delivered on destination chain' },
]

const STEP_ORDER: BridgeStep[] = ['initiating', 'pending', 'confirming', 'complete']

interface BridgeProgressProps {
  currentStep: BridgeStep
  provider: 'layerzero' | 'relay'
  txHash?: string
}

function getStepStatus(stepId: BridgeStep, currentStep: BridgeStep): 'done' | 'active' | 'upcoming' {
  const stepIdx = STEP_ORDER.indexOf(stepId)
  const currentIdx = STEP_ORDER.indexOf(currentStep)
  if (stepIdx < currentIdx) return 'done'
  if (stepIdx === currentIdx) return 'active'
  return 'upcoming'
}

export function BridgeProgress({ currentStep, provider, txHash }: BridgeProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-2xl bg-gradient-to-br from-lavender-50 to-mint-50 border border-lavender-200 p-5"
    >
      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-sm font-semibold text-gray-500 mb-1">Bridging via {provider === 'layerzero' ? 'LayerZero' : 'Relay'}</p>
        <p className="text-lg font-bold text-gray-800">
          {currentStep === 'complete' ? 'Bridge Complete!' : 'Bridge in Progress...'}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id, currentStep)
          return (
            <div key={step.id} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor:
                      status === 'done' ? '#10b981'
                      : status === 'active' ? '#c4b5fd'
                      : '#e5e7eb',
                    scale: status === 'active' ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
                >
                  {status === 'done' ? (
                    <Check size={14} className="text-white" />
                  ) : status === 'active' ? (
                    <Loader2 size={14} className="text-lavender-700 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                </motion.div>
                {index < STEPS.length - 1 && (
                  <motion.div
                    className="w-0.5 h-8 mt-1"
                    animate={{
                      backgroundColor: status === 'done' ? '#10b981' : '#e5e7eb',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              {/* Text */}
              <div className={`pb-6 ${index === STEPS.length - 1 ? 'pb-0' : ''}`}>
                <p className={`font-semibold text-sm ${status === 'upcoming' ? 'text-gray-400' : 'text-gray-800'}`}>
                  {step.label}
                </p>
                <p className={`text-xs mt-0.5 ${status === 'upcoming' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tx hash */}
      <AnimatePresence>
        {txHash && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-lavender-200"
          >
            <p className="text-xs text-gray-500 mb-1 font-medium">Transaction Hash</p>
            <a
              href={`#tx-${txHash}`}
              className="text-xs font-mono text-lavender-600 hover:text-lavender-700 break-all hover:underline transition-colors"
            >
              {txHash}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete celebration */}
      <AnimatePresence>
        {currentStep === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
            className="mt-4 text-center text-3xl"
          >
            🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
