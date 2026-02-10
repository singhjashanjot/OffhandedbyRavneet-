# Offhanded — Immersive Art Experiences Platform 🔥
<img width="1858" height="918" alt="image" src="https://github.com/user-attachments/assets/0e54e176-6f25-4baa-990d-a3e8277717f6" />


Professional, modern web application for Offhanded — a brand crafting immersive, meditative art workshops and experiences.


---

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture & Project Layout](#architecture--project-layout)
5. [Getting Started (Developer)](#getting-started-developer)
   - [Prerequisites](#prerequisites)
   - [Install & Run](#install--run)
   - [Useful Scripts](#useful-scripts)
6. [Environment](#environment)
7. [Design & Frontend Patterns](#design--frontend-patterns)
8. [Deployment & Hosting](#deployment--hosting)
9. [Quality & Tooling](#quality--tooling)
10. [Roadmap & Backend Plan](#roadmap--backend-plan)
11. [Contributing](#contributing)
12. [License & Contact](#license--contact)

---

## Overview
Offhanded is a polished Next.js web application designed to showcase and sell immersive art workshops (pottery texture art, canvas painting, punch-needle, cake painting, and more) and physical products. This repository contains the frontend (Next.js App Router) and a foundation for adding backend services (Supabase, Razorpay for payments).

This README provides a developer-focused, production-ready reference for setup, architecture, development workflow, environment configuration, and deployment.

---

## Key Features ✨
- Workshop listings and event pages with booking flows
- Product listing and checkout flow (cart, orders)
- Gallery & testimonials
- Auth-ready structure (planned Supabase integration)
- Responsive, accessible UI built with Tailwind CSS
- Smooth scrolling and motion (Lenis + Framer Motion)

---

## Tech Stack 🔧
- Next.js 14 (App Router) + React 18
- TypeScript for type-safety
- Tailwind CSS for utility-first styling
- Framer Motion & Lenis for animations & smooth scrolling
- ESLint & Prettier for consistent code style

---

## Architecture & Project Layout 📁
Workspace is organized as a monorepo (PNPM/Yarn/NPM workspaces compatible):

- `apps/web/` — Next.js frontend (TypeScript, Tailwind)
  - `src/app/` — App Router pages and route handlers
  - `src/components/` — Shared components & UI primitives
  - `src/data/` — Static site data (categories, testimonials, workshops)
- `packages/` — (reserved for shared packages/utilities)

Example file tree (high level):
```
apps/web/
├─ src/
│  ├─ app/ (pages & route handlers)
│  ├─ components/ (Header, Footer, Sections, UI)
│  └─ data/ (static content seeds)
└─ package.json
```

---

## Getting Started (Developer) 🚀
### Prerequisites
- Node.js >= 18.x
- npm >= 9 (or a compatible workspace-aware package manager)

> Windows note: this repository has been developed on Windows; standard npm commands work in PowerShell.

### Install & Run
Clone the repo and install dependencies:

```bash
# from repository root
npm install

# run dev server (workspace aware)
npm run dev
```

Open http://localhost:3000 to view locally.

### Useful Scripts
- `npm run dev` — runs the `apps/web` Next.js dev server
- `npm run build` — builds the web app for production
- `npm run start` — starts the production server
- `npm run lint` — runs ESLint

(You can also `cd apps/web` and use `next dev` / `next build` directly.)

---

## Environment ⚙️
This project is frontend-first; a full backend is planned (Supabase + Razorpay). Add a `.env.local` in `apps/web` for any runtime keys. Recommended env variables (when backend is added):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (server-only)
- `RAZORPAY_KEY_ID` (server-only)
- `RAZORPAY_KEY_SECRET` (server-only)

Keep secrets out of the repo and add them to your hosting provider (Vercel, Netlify) as environment variables.

---

## Design & Frontend Patterns 🎨
- Styling: Tailwind CSS (utility-first, configurable in `tailwind.config.js`)
- Animations: Framer Motion for interactions; Lenis for smooth scrolling
- Component Patterns: Small, composable presentational components living in `src/components` and section/layout components for pages
- Accessibility: Prefer semantic elements and ensure components are keyboard-navigable

---

## Deployment & Hosting ☁️
Recommended: Vercel
- Connect the monorepo and set the root project to `apps/web`.
- Configure environment variables in the Vercel project settings.
- Vercel automatically runs `npm run build` and serves the app.

Alternative hosts: Netlify, Render, or self-hosted Node servers behind a CDN.

---

## Quality & Tooling ✅
- TypeScript provides compile-time safety
- ESLint + `eslint-config-next` for linting
- Prettier + `prettier-plugin-tailwindcss` for formatting
- Add tests and a CI pipeline (GitHub Actions) to enforce quality on PRs

---

## Roadmap & Backend Plan 📌
A thorough backend implementation plan is available in `IMPLEMENTATION_PLAN.md`. Highlights:
- Supabase (Postgres, Auth, Storage) for backend and media
- Razorpay for payments and payment verification
- Data models: users_profiles, workshops, bookings, products, orders, payments
- Server-side enforcement: RLS, constraints, idempotent payment verification, audit logs

This README is frontend-first; the backend plan is ready to be implemented as API endpoints or Supabase Edge Functions.

---

## Contributing 🤝
We welcome contributions with the following process:
1. Fork the repo and create a feature branch (name: `feat/xxx` or `fix/xxx`).
2. Open a descriptive PR against `main` with summary and testing instructions.
3. Keep commits focused and sign-off on the PR when ready.

Please follow the code style enforced by ESLint & Prettier. Consider adding unit and integration tests for new features.

---

## License & Contact 📬
- License: Private — All rights reserved.
- Author: Offhanded Team

For questions or collaboration, open an issue or contact the repository owner.



