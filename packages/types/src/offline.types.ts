export type ConnectionMode = 'auto' | 'offline' | 'online'

export interface OfflineFeatures {
  orders: boolean
  inventory: boolean
  invoices: boolean
  ledger: boolean
  delivery: boolean
  notifications: boolean
}

export interface OfflineSyncSettings {
  onReconnect: boolean
  notifyOnComplete: boolean
  alertOnConflict: boolean
}

export interface OfflineSettings {
  mode: ConnectionMode
  features: OfflineFeatures
  sync: OfflineSyncSettings
}

export interface SyncQueueItem {
  id?: number
  action: 'CREATE_ORDER' | 'UPDATE_ORDER' | 'UPDATE_STOCK' | 'CREATE_INVOICE' | 'CREATE_LEDGER_ENTRY'
  payload: Record<string, unknown>
  timestamp: number
  retries: number
  status: 'PENDING' | 'SYNCING' | 'DONE' | 'FAILED' | 'CONFLICT'
}
