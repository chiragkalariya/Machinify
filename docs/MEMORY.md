# MEMORY.md

## Decisions Log
- Chose MySQL over PostgreSQL because local setup is simpler and the team is more familiar with MySQL CLI and Workbench.
- Chose Zustand over Redux because ShopElite is medium-sized and Zustand eliminates boilerplate while supporting local persistence.
- Chose React Query over SWR because we need strong mutation support, cache invalidation, and devtools for order/cart flows.
- Chose Razorpay over Stripe because Razorpay supports INR payments and is better aligned to the Indian market.
- Chose Cloudinary over S3 because Cloudinary offers a free tier with built-in image transforms and upload widget support.

## Gotchas & Lessons
- `Sequelize.sync({ alter: true })` is safe in dev, NEVER in production — production changes must use migrations.
- Cloudinary `public_id` must be saved to DB for deletion — otherwise images cannot be removed reliably.
- Razorpay signature must be verified server-side always — client-side verification is insecure.
- JWT refresh token must be stored in DB for revocation — otherwise compromised tokens cannot be invalidated.
- React Query keys must be arrays, never strings — otherwise cache invalidation and query deduping break.
- Tailwind purge will remove dynamic classes — always use full class names or `safelist`.
- Framer Motion `AnimatePresence` requires unique `key` on children — identical keys cause stale animations.
- Axios interceptor refresh loop — use `_retry` flag to prevent infinite retry on 401.
- Sequelize associations must be defined before `sync` or migrations run — missing order breaks joins.

## Naming Conventions
- Files: `PascalCase` for components, `camelCase` for utils/hooks/services.
- CSS classes: `kebab-case` for custom classes, Tailwind utilities inline.
- DB tables: `snake_case` plural (`users`, `order_items`, `product_images`).
- API routes: `/api/resource` with plural nouns, lowercase, `kebab-case` for multi-word.
- Env vars: `SCREAMING_SNAKE_CASE`, prefixed with `DB_`, `JWT_`, `SMTP_`, `RAZORPAY_`, `CLOUDINARY_`.
- Git branches: `feature/name`, `fix/name`, `chore/name`, `release/v1.x`.

## Component Patterns
- All form inputs are wrapped in `Input` from `components/common/`.
- All pages export a named export, not default.
- All API calls go through `services/api.ts`, never raw `fetch` in components.
- All error states use `toast` from `react-hot-toast`.
- All loading states use a `Skeleton` component, never spinner text.

## API Conventions
- All success responses: `{ success: boolean, data?: T, message?: string }`.
- All errors: `{ success: false, message: string, errors?: FieldError[] }`.
- Pagination response: `{ data, total, page, pages, limit }`.
- Auth header: `Authorization: Bearer <token>`.
- Admin routes prefixed: `/api/admin/...`.
