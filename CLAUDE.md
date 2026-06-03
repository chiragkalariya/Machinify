# CLAUDE.md

## Project identity
- Name: ShopElite
- Stack: React 18 + TypeScript + Vite + Tailwind + Framer Motion + Zustand + React Query + Axios + React Router DOM + Zod / Node.js + Express + Sequelize + MySQL + JWT + Cloudinary + Razorpay + Nodemailer
- One-liner: Production-ready Indian e-commerce platform with modern React frontend, Express backend, and payment/order workflows.

## Absolute rules
- Never introduce or leave `any` in TypeScript code.
- Never create class components; use functional components only.
- Never assume missing details; ask if requirements are ambiguous.
- Never execute destructive shell/git operations without explicit approval.
- Never change architecture without confirming the intended direction first.

## File operation rules
- Always read existing files before editing them.
- Never overwrite a file blindly; show the diff or list exact changes first.
- Confirm before deleting any file or directory.
- Prefer patch edits over full-file rewrites when updating existing code.
- If file content is unclear, ask for the exact path and current usage.

## Code generation rules
- TypeScript must be strict-compatible.
- Always export types and interfaces explicitly.
- Use `const` and `let`; avoid `var`.
- Use Zod schemas for request and form validation.
- Use React hooks and functional components only.
- Use named exports for components and utilities wherever project conventions require it.

## Shell/git rules
- Never force push (`git push --force`) without explicit approval.
- Always show `git status` before staging or committing changes.
- Prefix commits with conventional type: `feat/`, `fix/`, `chore/`, `refactor/`.
- Use terminal only for safe, minimal commands unless directed otherwise.
- When making a commit recommendation, include the exact command and summary.

## Response format rules
- No fluff; answer in code-first format.
- Always show file path before code snippets.
- Use inline comments (`//`) instead of block comments (`/* */`) in TS/JS code examples.
- Keep explanations minimal and actionable.
- If multiple files are affected, list paths first and then code.

## Folder awareness
- Root source layout:
  - `apps/`
    - `shop-dashboard/`
    - `super-admin/`
  - `packages/`
    - `ui/`
    - `utils/`
    - `config/`
    - `types/`
- Frontend source paths:
  - `apps/shop-dashboard/src/`
  - `apps/super-admin/src/`
  - `apps/storefront/src/`
- Backend source paths:
  - `apps/api/src/`
- Do not create files outside these known source folders unless explicitly instructed.
