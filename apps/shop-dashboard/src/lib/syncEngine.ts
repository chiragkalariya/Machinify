import { db } from './db'
import type { SyncQueueItem } from '@bizflow/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function flushQueue(): Promise<void> {
  const pendingItems = await db.syncQueue
    .where('status')
    .equals('PENDING')
    .toArray()

  for (const item of pendingItems) {
    if (!item.id) continue

    try {
      // Set status to SYNCING
      await db.syncQueue.update(item.id, { status: 'SYNCING' })

      // POST to sync endpoint
      const response = await fetch(`${API_URL}/api/v1/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: item.action,
          payload: item.payload,
          timestamp: item.timestamp
        })
      })

      if (response.status === 200) {
        // Success: delete from queue
        await db.syncQueue.delete(item.id)
      } else if (response.status === 409) {
        // Conflict: keep in queue, mark as CONFLICT
        await db.syncQueue.update(item.id, { status: 'CONFLICT' })
      } else {
        // Other error: increment retries
        const newRetries = item.retries + 1
        if (newRetries >= 3) {
          await db.syncQueue.update(item.id, { status: 'FAILED', retries: newRetries })
        } else {
          await db.syncQueue.update(item.id, { status: 'PENDING', retries: newRetries })
        }
      }
    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error)
      const newRetries = item.retries + 1
      if (newRetries >= 3) {
        await db.syncQueue.update(item.id, { status: 'FAILED', retries: newRetries })
      } else {
        await db.syncQueue.update(item.id, { status: 'PENDING', retries: newRetries })
      }
    }
  }
}

export async function getPendingCount(): Promise<number> {
  return db.syncQueue
    .where('status')
    .equals('PENDING')
    .count()
}

export async function getConflictCount(): Promise<number> {
  return db.syncQueue
    .where('status')
    .equals('CONFLICT')
    .count()
}
