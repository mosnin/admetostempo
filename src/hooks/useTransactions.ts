'use client'
import { useState, useCallback } from 'react'
import type { Transaction, PaginatedResponse } from '@/types'
import { useAppStore } from '@/store/useAppStore'

type TransactionFilter = 'all' | 'sent' | 'received'

export function useTransactions() {
  const { transactions, setTransactions, addTransaction } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchTransactions = useCallback(
    async (filter: TransactionFilter = 'all', pageNum = 1) => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          filter,
          page: pageNum.toString(),
          pageSize: '20',
        })
        const res = await fetch(`/api/payments?${params}`)
        const json: PaginatedResponse<Transaction> = await res.json()

        if (!res.ok) {
          throw new Error('Failed to fetch transactions')
        }

        if (pageNum === 1) {
          setTransactions(json.data)
        } else {
          setTransactions([...transactions, ...json.data])
        }

        setPage(pageNum)
        setHasMore(json.hasMore)
        setTotal(json.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    },
    [transactions, setTransactions]
  )

  const sendPayment = useCallback(
    async (payload: {
      to_address: string
      to_username?: string
      amount: string
      currency?: string
      memo?: string
      tx_hash?: string
    }) => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to send payment')
        }

        addTransaction(json.data as Transaction)
        return json.data as Transaction
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        throw new Error(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [addTransaction]
  )

  const loadMore = useCallback(
    (filter: TransactionFilter = 'all') => {
      if (!isLoading && hasMore) {
        fetchTransactions(filter, page + 1)
      }
    },
    [isLoading, hasMore, page, fetchTransactions]
  )

  return {
    transactions,
    isLoading,
    error,
    hasMore,
    total,
    fetchTransactions,
    sendPayment,
    loadMore,
  }
}
