import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { flushQueue, getPendingCount, getConflictCount } from '../lib/syncEngine'

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false)

  // Use live queries to get real-time counts
  const pendingItems = useLiveQuery(
    () => db.syncQueue.where('status').equals('PENDING').toArray(),
    []
  )
  const conflictItems = useLiveQuery(
    () => db.syncQueue.where('status').equals('CONFLICT').toArray(),
    []
  )

  const pendingCount = pendingItems?.length ?? 0
  const conflictCount = conflictItems?.length ?? 0

  const syncNow = useCallback(async () => {
    setIsSyncing(true)
    try {
      await flushQueue()
    } catch (error) {
      console.error('Failed to sync:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  return {
    pendingCount,
    conflictCount,
    isSyncing,
    syncNow
  }
}
