import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import type { OfflineSettings, OfflineFeatures, OfflineSyncSettings, ConnectionMode } from '@bizflow/types'
import { flushQueue } from './syncEngine'

const DEFAULT_FEATURES: OfflineFeatures = {
  orders: true,
  inventory: true,
  invoices: true,
  ledger: true,
  delivery: false,
  notifications: true
}

const DEFAULT_SYNC: OfflineSyncSettings = {
  onReconnect: true,
  notifyOnComplete: true,
  alertOnConflict: true
}

const DEFAULT_SETTINGS: OfflineSettings = {
  mode: 'auto',
  features: DEFAULT_FEATURES,
  sync: DEFAULT_SYNC
}

const STORAGE_KEY = 'bizflow-offline-settings'

interface OfflineContextType {
  settings: OfflineSettings
  isOffline: boolean
  networkOnline: boolean
  update: (partial: Partial<OfflineSettings>) => void
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OfflineSettings>(DEFAULT_SETTINGS)
  const [networkOnline, setNetworkOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

  // Load settings from localStorage on init
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSettings(parsed)
      } catch (e) {
        console.error('Failed to parse offline settings from localStorage', e)
      }
    }
  }, [])

  // Listen to network events
  useEffect(() => {
    const handleOnline = () => {
      setNetworkOnline(true)
    }
    const handleOffline = () => {
      setNetworkOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Sync when reconnected
  useEffect(() => {
    if (networkOnline && settings.sync.onReconnect && settings.mode !== 'offline') {
      flushQueue().catch(e => console.error('Failed to flush sync queue', e))
    }
  }, [networkOnline, settings.sync.onReconnect, settings.mode])

  const isOffline = 
    settings.mode === 'offline' 
      ? true 
      : settings.mode === 'online' 
      ? false 
      : !networkOnline

  const update = useCallback((partial: Partial<OfflineSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <OfflineContext.Provider value={{ settings, isOffline, networkOnline, update }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline(): OfflineContextType {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
