import { useCallback } from 'react'
import { useOffline } from '../lib/offlineContext'
import { db } from '../lib/db'

interface UpdateStockPayload {
  [key: string]: unknown
}

export function useUpdateStock() {
  const { isOffline, settings } = useOffline()

  const updateStock = useCallback(async (payload: UpdateStockPayload) => {
    // Check if we should work offline or if offline mode is disabled for inventory
    if (isOffline || !settings.features.inventory) {
      // Write to local database
      await db.inventory.put(payload)

      // Add to sync queue
      await db.syncQueue.add({
        action: 'UPDATE_STOCK',
        payload,
        timestamp: Date.now(),
        retries: 0,
        status: 'PENDING'
      })

      return { synced: false }
    }

    // Online: POST to API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/inventory`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Failed to update stock: ${response.statusText}`)
    }

    return { synced: true }
  }, [isOffline, settings.features.inventory])

  return { updateStock }
}
