# CONTEXT.md

## Project Status
- Current phase: checkout and admin panel completion.
- Built: auth module, product listing/detail pages, cart functionality, checkout page skeleton.
- In progress: checkout payment flow, order review, admin panel product/order dashboards.
- Next: finalize Razorpay checkout, implement order confirmation, finish admin user/product CRUD.

## Current Sprint
- [~] Checkout page payment integration
- [~] Order summary and tax calculation
- [ ] Admin product list filtering
- [ ] Admin order status update
- [ ] Save Cloudinary image metadata in product model
- [x] User auth registration and login
- [x] Product pages and browsing
- [x] Cart add/remove/update
- [x] Basic admin panel shell

## Open Questions
- Should checkout save address as "billing" and "shipping" separately now or later?
- Should admin user roles include `manager` vs `super-admin` for later access control?
- Which Razorpay webhook event should trigger order fulfilment updates first?
- Does the product entity require `variant` support in this phase?

## Active Files
- `apps/storefront/src/app/checkout/page.tsx`
- `apps/api/src/modules/orders/order.controller.ts`
- `apps/api/src/modules/payments/payment.service.ts`
- `apps/shop-dashboard/src/pages/AdminDashboard.tsx`
- `packages/ui/src/components/common/Input.tsx`

## Environment State
- Dev server: frontend `vite` running, backend Express local on `http://localhost:4000`.
- Known issues: checkout page intermittently throws 401 on refresh token renewal.
- Last tested feature: cart add/remove and product detail view in dev browser.

## Recent Decisions
- Used `localStorage` for tokens and Axios interceptor refresh logic for auth flows.
- Moved checkout totals into a shared `useCart` Zustand slice for consistency.
- Standardized API success payloads across `/api` routes.
- Added `order_items` as a separate join table for cart and order history.
- Decided admin routes must use `/api/admin/...` and require `isAdmin` middleware.

## Blockers
- Razorpay callback verification not yet connected to final order status.
- Admin product update page missing Cloudinary upload integration.
- Checkout tax/shipping calculation logic still incomplete.

## Next Session Checklist
1. Finish `/apps/api/src/modules/payments/payment.service.ts` Razorpay signature verification.
2. Complete frontend checkout payment flow in `apps/storefront/src/app/checkout/page.tsx`.
3. Add admin product CRUD hooks and page components in `apps/shop-dashboard/src/pages/`.
4. Test refresh token flow and fix Axios retry bug.
5. Update `CONTEXT.md` and `MEMORY.md` after the checkout/payment fix.
