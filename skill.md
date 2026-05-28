---
name: bizflow
description: >
  BizFlow project skill — use this for ANY task related to the BizFlow B2B SaaS
  platform. Triggers whenever the user wants to create, edit, or scaffold any
  module, file, component, API endpoint, schema, or feature inside the BizFlow
  monorepo. Also triggers for questions about project conventions, folder
  structure, naming patterns, tech stack choices, or how modules connect.
  Always read this skill before writing any BizFlow code.
---

# BizFlow — project skill

BizFlow is a B2B SaaS platform for Indian SMBs combining:
- A B2B ecommerce storefront (shops sell to industries)
- Accounting + GST engine (replaces Tally)
- Delivery tracking (like Porter, built-in)
- Procurement / vendor management

---

## Monorepo structure

```
bizflow/                          ← root (Turborepo + npm workspaces)
├── apps/
│   ├── storefront/               ← Next.js 14 (App Router) — public marketplace
│   ├── shop-dashboard/           ← Vite + React — shop owner panel (behind login)
│   ├── super-admin/              ← Vite + React — internal ops panel (behind login)
│   └── api/                      ← NestJS + TypeScript — single backend for all apps
├── packages/
│   ├── ui/                       ← shared React components (used by all frontends)
│   ├── types/                    ← shared TypeScript types (used by all apps)
│   ├── utils/                    ← shared utility functions (GST calc, formatters)
│   └── config/                   ← shared ESLint + Tailwind + tsconfig
├── turbo.json
└── package.json                  ← root workspace
```

---

## Tech stack — never deviate from this

| Layer | Technology | Reason |
|---|---|---|
| Public frontend | Next.js 14 (App Router) | SSR for fast load on Indian 4G + SEO for shop/product pages |
| Admin frontends | Vite + React | Behind login — no SSR needed, faster DX |
| Mobile (phase 2) | React Native (Expo) | Reuses React knowledge |
| Backend | NestJS + TypeScript | Enforced module structure, built-in guards/DI/Swagger |
| ORM | Prisma | Type-safe queries, works perfectly with NestJS + TypeScript |
| Primary DB | PostgreSQL | Relational = correct for accounting + multi-tenant data |
| Cache / sessions | Redis | Sessions, API cache, rate limiting |
| Job queue | Bull + Redis | Background jobs (PDF gen, WhatsApp alerts, e-way bill) |
| Search (phase 2) | Elasticsearch | Product search with typo tolerance (use pg_trgm for MVP) |
| Cloud | AWS Mumbai (ap-south-1) | Lowest latency for Indian users |
| File storage | AWS S3 | Invoice PDFs, product images |
| CDN | AWS CloudFront | Static assets + Next.js ISR pages |
| Real-time | Socket.io | Live delivery tracking, order status updates |
| Payments | Razorpay | UPI, NEFT, payment links, shop payouts |
| WhatsApp | Gupshup or Wati | Order alerts to buyers and shops |
| GST / compliance | ClearTax API | GST number verification, GSTR filing |
| Delivery | Shiprocket / Delhivery | Logistics + e-way bill generation |
| Containerisation | Docker + Docker Compose | Local dev environment |

---

## Package naming convention

All packages use the `@bizflow/` scope:

```
@bizflow/storefront
@bizflow/shop-dashboard
@bizflow/super-admin
@bizflow/api
@bizflow/ui
@bizflow/types
@bizflow/utils
@bizflow/config
```

---

## NestJS API — module structure

```
apps/api/src/
├── modules/
│   ├── orders/             ← order creation, status updates, order history
│   ├── inventory/          ← stock levels, deduction, low-stock alerts
│   ├── accounting/         ← ledger entries, GST split, invoice generation
│   ├── delivery/           ← driver assignment, GPS tracking, e-way bill
│   ├── storefront/         ← product listings, shop profiles, search
│   ├── notifications/      ← WhatsApp, email, in-app alerts via Bull queues
│   ├── auth/               ← JWT auth, roles (BUYER / SHOP_OWNER / SUPER_ADMIN)
│   ├── procurement/        ← RFQ, vendor management, PO workflow
│   └── sync/               ← offline sync endpoint for shop-dashboard
├── common/
│   ├── guards/             ← RolesGuard, JwtAuthGuard
│   ├── decorators/         ← @CurrentUser(), @Roles()
│   ├── filters/            ← GlobalExceptionFilter
│   └── interceptors/       ← LoggingInterceptor, TransformInterceptor
├── prisma/
│   └── schema.prisma       ← single Prisma schema for all modules
└── main.ts
```

Each NestJS module always contains:
```
orders/
├── orders.module.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.gateway.ts       ← only if module uses Socket.io
├── dto/
│   ├── create-order.dto.ts
│   └── update-order.dto.ts
└── entities/
    └── order.entity.ts
```

---

## Next.js storefront — folder structure

```
apps/storefront/src/
├── app/
│   ├── (public)/                 ← no auth required
│   │   ├── page.tsx              ← homepage / marketplace
│   │   ├── products/
│   │   │   ├── page.tsx          ← product listing
│   │   │   └── [slug]/page.tsx   ← product detail (SSR for SEO)
│   │   └── shops/
│   │       ├── page.tsx          ← shop directory
│   │       └── [slug]/page.tsx   ← shop profile (SSR for SEO)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── orders/
│       ├── page.tsx              ← buyer order history
│       └── [id]/
│           ├── page.tsx          ← order detail
│           └── track/page.tsx    ← live tracking (Socket.io client)
├── components/
│   ├── layout/                   ← Navbar, Footer, Sidebar
│   ├── product/                  ← ProductCard, ProductGrid, ProductFilter
│   ├── order/                    ← OrderCard, OrderStatus, TrackingMap
│   └── shared/                   ← re-exports from @bizflow/ui
├── lib/
│   ├── api.ts                    ← Axios instance with base URL + auth headers
│   ├── socket.ts                 ← Socket.io client singleton
│   └── auth.ts                   ← NextAuth or custom auth helpers
└── types/                        ← page-specific types (import from @bizflow/types first)
```

---

## Vite + React dashboards — folder structure

Same structure for both `shop-dashboard` and `super-admin`:

```
apps/shop-dashboard/src/
├── pages/
│   ├── Dashboard.tsx
│   ├── Orders.tsx
│   ├── Products.tsx
│   ├── Inventory.tsx
│   ├── Accounting.tsx
│   ├── Delivery.tsx
│   └── settings/
│       └── Connection.tsx       ← offline/online settings panel
├── components/
│   ├── layout/                  ← Sidebar, Topbar, PageWrapper
│   ├── offline/                 ← OfflineBanner, SyncStatusBar, ConnectionBadge
│   └── shared/                  ← re-exports from @bizflow/ui
├── hooks/
│   ├── useOrders.ts             ← reads isOffline, routes to IndexedDB or API
│   ├── useInventory.ts
│   ├── useAuth.ts
│   └── useSync.ts               ← flush sync queue, conflict resolution
├── lib/
│   ├── api.ts                   ← Axios instance
│   ├── db.ts                    ← Dexie IndexedDB schema (offline store)
│   ├── offlineContext.tsx        ← OfflineProvider + useOffline hook
│   ├── syncEngine.ts            ← flush queue to API on reconnect
│   └── queryClient.ts           ← React Query client
└── types/                       ← import from @bizflow/types first
```

---

## Shared types — packages/types/

Always define types here first. Never duplicate types across apps.

```typescript
// packages/types/order.types.ts
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export interface Order {
  id: string
  buyerId: string
  shopId: string
  items: OrderItem[]
  total: number
  gstAmount: number
  status: OrderStatus
  createdAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  unitPrice: number
  hsnCode: string
  gstRate: number       // 5 | 12 | 18 | 28
}
```

```typescript
// packages/types/user.types.ts
export type UserRole = 'BUYER' | 'SHOP_OWNER' | 'SUPER_ADMIN' | 'DRIVER'

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: UserRole
  gstNumber?: string    // required for SHOP_OWNER
}
```

---

## Key business rules — always enforce these

### GST rules
- Every product must have an HSN code and GST rate (5%, 12%, 18%, or 28%)
- GST is always split into CGST + SGST (intra-state) or IGST (inter-state)
- Invoice must show: base price, GST %, CGST, SGST/IGST, total
- All amounts stored in **paise** (integer) in DB — never store floats for money

### Order flow — atomic transaction
When an order is created, always use a Prisma transaction that:
1. Deducts inventory (`stock: { decrement: quantity }`)
2. Creates the order record
3. Creates ledger entry with GST split

If any step fails, all three roll back.

```typescript
// Always use this pattern in orders.service.ts
await this.prisma.$transaction(async (tx) => {
  await tx.inventory.update({ ... })   // step 1
  const order = await tx.order.create({ ... })  // step 2
  await tx.ledgerEntry.create({ ... }) // step 3
  return order
})
```

### Background jobs — always async
After transaction completes, fire Bull jobs — never block the API response:
```typescript
await this.notifyQueue.add('whatsapp-alert', { orderId })
await this.invoiceQueue.add('generate-pdf', { orderId })
await this.deliveryQueue.add('assign-driver', { orderId })
```

### Live tracking — Socket.io rooms
Each order has its own Socket.io room: `order-{orderId}`
- Buyer joins the room on the tracking page
- Driver app sends GPS every 10 seconds → NestJS broadcasts to room
- Shop dashboard also subscribes to see all active deliveries

### Auth roles
```
BUYER       → can browse, order, track
SHOP_OWNER  → can manage own shop, products, orders, accounting
SUPER_ADMIN → can manage all shops, users, disputes, analytics
DRIVER      → can update delivery status and GPS location
```

Use `@Roles()` decorator + `RolesGuard` on every controller endpoint.

---

## Shared UI components — packages/ui/

Build once, use in all frontends. Always check here before creating a new component.

| Component | Purpose |
|---|---|
| `<Button>` | Primary, secondary, destructive variants |
| `<DataTable>` | Sortable, paginated table for orders, products, ledger |
| `<InvoiceCard>` | Renders invoice with GST breakdown |
| `<StatusBadge>` | Colour-coded order/delivery status pill |
| `<TrackingMap>` | Leaflet.js map with live driver pin |
| `<ProductCard>` | Product listing card with price + GST display |
| `<RFQForm>` | Request for quotation form |

All components use Tailwind CSS. Import Tailwind config from `@bizflow/config`.

---

## Environment variables — naming convention

```
# API (NestJS)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
GUPSHUP_API_KEY=...
CLEARTAX_API_KEY=...
SHIPROCKET_TOKEN=...
AWS_S3_BUCKET=bizflow-assets
AWS_REGION=ap-south-1

# Storefront (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Dashboards (Vite)
VITE_API_URL=http://localhost:3001
```

---

## turbo.json — correct format (Turborepo 2.x)

Always use `tasks` not `pipeline` — `pipeline` was removed in Turborepo 2.0.
Also always include `packageManager` in root `package.json`.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

```json
// root package.json — required fields
{
  "name": "bizflow",
  "private": true,
  "packageManager": "npm@10.9.7",
  "workspaces": ["apps/*", "packages/*"]
}
```

---

## Ports — local development

| App | Port |
|---|---|
| storefront (Next.js) | 3000 |
| api (NestJS) | 3001 |
| shop-dashboard (Vite) | 5175 |
| super-admin (Vite) | 5176 |
| PostgreSQL | 5432 |
| Redis | 6379 |

---

## Code conventions

- **TypeScript strict mode** everywhere — no `any`
- **Prisma** for all DB access — no raw SQL except for complex reports
- **Zod** for request validation in NestJS DTOs
- **React Query** for all API calls in frontend — no raw fetch/useEffect for data
- **Axios** for HTTP client — one instance per app in `lib/api.ts`
- **Named exports** only — no default exports except Next.js pages
- File names: `kebab-case.ts` for all files
- Component names: `PascalCase`
- API routes: REST — `/api/v1/orders`, `/api/v1/products`
- Always handle errors in Bull job processors — failed jobs must retry 3 times

---

## Offline-first architecture — shop-dashboard only

Only `apps/shop-dashboard` is offline-first. Storefront and super-admin are always online.

### Packages required
```bash
# inside apps/shop-dashboard
npm install dexie dexie-react-hooks vite-plugin-pwa workbox-window
```

### 3 connection modes
```
auto          → follows real network (navigator.onLine)
offline       → always use local IndexedDB regardless of network
online        → always hit API, fail if no internet
```

Settings are saved to `localStorage` key `bizflow-offline-settings` and persist across page refreshes.

### Dexie IndexedDB schema — apps/shop-dashboard/src/lib/db.ts
```typescript
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
```

### Offline types — packages/types/offline.types.ts
```typescript
export type ConnectionMode = 'auto' | 'offline' | 'online'

export interface OfflineFeatures {
  orders: boolean
  inventory: boolean
  invoices: boolean
  ledger: boolean
  delivery: boolean       // always false — requires live connection
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
```

### OfflineContext — apps/shop-dashboard/src/lib/offlineContext.tsx
```typescript
// useOffline() hook returns:
// - settings: OfflineSettings
// - isOffline: boolean  (computed from mode + navigator.onLine)
// - update(partial): void  (saves to localStorage)

// Automatically calls flushQueue() when:
// - Network comes back online AND
// - settings.sync.onReconnect === true AND
// - mode !== 'offline'
```

### Hook pattern — always route through isOffline
```typescript
// hooks/useOrders.ts
const { isOffline, settings } = useOffline()

async function createOrder(data: CreateOrderDto) {
  if (isOffline || !settings.features.orders) {
    await db.orders.add(data)                          // write to IndexedDB
    await db.syncQueue.add({                           // log for later sync
      action: 'CREATE_ORDER',
      payload: data,
      timestamp: Date.now(),
      retries: 0,
      status: 'PENDING'
    })
  } else {
    await api.post('/api/v1/orders', data)             // direct API call
  }
}
```

### Sync engine — apps/shop-dashboard/src/lib/syncEngine.ts
```typescript
// Exports: flushQueue(), getPendingCount(), getConflictCount()

// flushQueue() logic:
// 1. Read all PENDING items from syncQueue
// 2. For each item:
//    - Set status to SYNCING
//    - POST to /api/v1/sync with { action, payload, timestamp }
//    - On 200: delete from queue
//    - On 409 (conflict): keep in queue, set status to CONFLICT
//    - On other error: increment retries (max 3), then FAILED or stay PENDING
```

### vite.config.ts — PWA plugin
```typescript
import { VitePWA } from 'vite-plugin-pwa'

plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    manifest: {
      name: 'BizFlow Shop Dashboard',
      short_name: 'BizFlow',
      theme_color: '#1D9E75',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [{
        urlPattern: /^https?:\/\/.*\/api\/v1\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 200, maxAgeSeconds: 86400 }
        }
      }]
    }
  })
]
```

### NestJS sync endpoint — apps/api/src/modules/sync/
```
POST /api/v1/sync
Body: { action, payload, timestamp }
Auth: SHOP_OWNER only (@Roles('SHOP_OWNER'))

Handlers:
- CREATE_ORDER   → run same Prisma transaction as normal order creation (deduct inventory, create order, create ledger entry)
- UPDATE_ORDER   → update order record
- UPDATE_STOCK   → update inventory record
- CREATE_INVOICE → save invoice to S3 + DB
- CREATE_LEDGER_ENTRY → save ledger entry

Conflict detection:
- If record was modified after timestamp → return HTTP 409 (Conflict)
```

### Offline UI components — apps/shop-dashboard/src/components/offline/
```
OfflineBanner.tsx         → yellow sticky top banner when isOffline = true
                           Text: "You are working offline. Changes will sync when connection is restored."

SyncStatusBar.tsx         → floating bottom-right bar when pendingCount > 0 OR conflictCount > 0
                           Shows pending count + conflict count (in red) + "Sync now" button + spinner

ConnectionBadge.tsx       → small topbar badge with green/amber dot + "Online"/"Offline" text
                           Also shows pending count if > 0
```

### Settings page route
`/settings/connection` → `apps/shop-dashboard/src/pages/settings/Connection.tsx`

Shows 3 sections:
1. **Mode selector** — 3 cards (Auto/Offline/Online) with radio buttons
2. **Feature toggles** — one toggle per feature (delivery locked with tooltip)
3. **Auto-sync settings** — toggles for onReconnect, notifyOnComplete, alertOnConflict

All changes call `update()` immediately and save to localStorage.

### Rules for offline-first code
- NEVER call API directly in a component — always go through a hook (useOrders, useInventory, etc.)
- NEVER skip adding to syncQueue when writing offline — data will be lost on refresh
- NEVER enable delivery tracking offline — Socket.io requires live connection (locked toggle)
- ALWAYS wrap OfflineProvider at root of shop-dashboard App.tsx
- ALWAYS show OfflineBanner and SyncStatusBar in the layout
- ALWAYS persist sync queue items before showing success to user
- ALWAYS check `isOffline` or `settings.features.X` before routing to offline vs online path

---

## What NOT to do

- Never use MongoDB — accounting requires relational integrity
- Never store money as float — always paise (integer)
- Never skip GST split on invoices — legally required in India
- Never put business logic in Next.js API routes — all logic goes in NestJS
- Never create components that duplicate what's in `@bizflow/ui`
- Never hardcode API URLs — always use environment variables
- Never use Express directly — always NestJS modules and decorators
- Never skip the Prisma transaction on order creation

---

## Indian market specifics

- Phone number is primary identifier — not email (many SMB owners have no email)
- Always support UPI as first payment option
- GST number (GSTIN) is 15 characters — validate format: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
- E-way bill required for goods > ₹50,000 in value moving interstate
- WhatsApp notifications are more reliable than email for this audience
- Support vernacular (Hindi) in UI labels where possible (phase 2)
- All currency display: use `₹` symbol, Indian number format (1,00,000 not 100,000)

---

## When generating code — checklist

Before writing any file, check:
- [ ] Is the type already defined in `@bizflow/types`? Use it, don't redefine.
- [ ] Is there already a shared component in `@bizflow/ui`? Use it.
- [ ] Does the NestJS module follow the standard structure (module / controller / service / dto / entity)?
- [ ] Does any order creation use a Prisma transaction?
- [ ] Are money amounts stored as integers (paise)?
- [ ] Are background tasks going to Bull queues, not blocking the API?
- [ ] Are environment variables used for all external service URLs and keys?
- [ ] Does the endpoint have the correct `@Roles()` decorator?

### Additional checks for shop-dashboard offline code
- [ ] Is `useOffline()` used to check `isOffline` before every API call?
- [ ] Does every offline write also add an entry to `db.syncQueue`?
- [ ] Is `OfflineProvider` wrapping the root `App.tsx`?
- [ ] Is `OfflineBanner` and `SyncStatusBar` shown in the layout?
- [ ] Is delivery tracking disabled when `isOffline = true`?
- [ ] Does the sync endpoint handle conflict (HTTP 409) correctly?
- [ ] Are offline settings persisted to `localStorage`?
