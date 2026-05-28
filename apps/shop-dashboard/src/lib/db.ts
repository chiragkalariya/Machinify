import Dexie, { type Table } from 'dexie'
import type { SyncQueueItem } from '@bizflow/types'

export class BizFlowDB extends Dexie {
  orders!: Table
  products!: Table
  ledger!: Table
  inventory!: Table
  invoices!: Table
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('bizflow-shop')
    this.version(1).stores({
      orders:    '++id, status, createdAt, shopId',
      products:  '++id, sku, stock, shopId',
      ledger:    '++id, type, amount, createdAt',
      inventory: '++id, productId, stock',
      invoices:  '++id, orderId, createdAt',
      syncQueue: '++id, action, status, timestamp'
    })
  }
}

export const db = new BizFlowDB()
