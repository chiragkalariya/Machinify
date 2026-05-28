import { useCallback } from 'react'
import { useOffline } from '../lib/offlineContext'
import { db } from '../lib/db'

interface CreateOrderPayload {
  [key: string]: unknown
}

export function useCreateOrder() {
  const { isOffline, settings } = useOffline()

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    // Check if we should work offline or if offline mode is disabled for orders
    if (isOffline || !settings.features.orders) {
      // Write to local database
      const orderId = await db.orders.add(payload)

      // Add to sync queue
      await db.syncQueue.add({
        action: 'CREATE_ORDER',
        payload,
        timestamp: Date.now(),
        retries: 0,
        status: 'PENDING'
      })

      return { id: orderId, synced: false }
    }

    // Online: POST to API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`)
    }

    const data = await response.json()
    return { id: data.id, synced: true }
  }, [isOffline, settings.features.orders])

  return { createOrder }
}
