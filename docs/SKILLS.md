# SKILLS.md

## Skill: Create a new API endpoint
Steps:
1. Add controller method in `apps/api/src/modules/...`.
2. Register route in module router file.
3. Add validation schema with Zod for request body/params.
4. Write a minimal test snippet or Postman-style request example.
5. Update API docs or README with endpoint contract.

## Skill: Create a new React page
Steps:
1. Create page component file under `apps/storefront/src/app/` or `apps/shop-dashboard/src/`.
2. Add route entry in `App.tsx` or router config.
3. Add nav link if the page is part of the main flow.
4. Add SEO meta tags via page layout or `react-helmet`.
5. Add loading and error states for async data.

## Skill: Create a Sequelize model
Steps:
1. Define model in `apps/api/src/modules/.../model.ts`.
2. Define associations in the same module or central model index.
3. Add a migration note or migration file stub if migrations are used.
4. Add a seed example data entry for dev/test environment.

## Skill: Build a reusable component
Rules:
- Define props interface first.
- Provide default props if needed.
- Use `forwardRef` for input-like components.
- Export from `components/common/index.tsx`.

## Skill: Add a Zustand store slice
Steps:
1. Define slice interface.
2. Set initial state.
3. Add actions/mutators.
4. Add selectors or derived state hooks.
5. Add persist config if state should survive refresh.

## Skill: Add Tailwind styling
Rules:
- Mobile-first responsive design.
- Use config tokens, not arbitrary values.
- Always include dark mode variant.
- Extract repeated patterns into `@layer components` in `tailwind.config.ts`.

## Skill: Debug an issue
Framework:
1. Reproduce the bug with steps or test case.
2. Isolate the failing module or component.
3. Form a hypothesis for root cause.
4. Implement a fix in the narrowest scope.
5. Verify the fix manually or with a regression test.
6. Document the root cause and resolution.

## Skill: Write a database query
Rules:
- Use Sequelize `findAll` / `findOne`, not raw SQL.
- Always include a `where` clause.
- Paginate with `limit` and `offset`.
- Eager load associations with `include`.

## Skill: Handle auth flow
Rules:
- JWT access token expires in 7d.
- Refresh token expires in 30d.
- Store tokens in `localStorage`.
- Attach access token via Axios interceptor.
- Refresh on 401 and retry original request.

## Skill: Submit a form
Steps:
1. Define Zod schema.
2. Manage React form state.
3. Validate on submit.
4. Call Axios service endpoint.
5. Show toast feedback.
6. Reset or redirect on success.
