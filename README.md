# NPPD Gym Admin Frontend

React + TypeScript admin panel for managing gyms, users, consultants, and dashboard insights in the NPPD ecosystem.

## Overview

This app provides role-protected admin workflows for:

- Admin authentication and session restoration
- Dashboard KPIs with charts
- Gym creation and gym listing
- User listing, inspection, and editing
- Consultant listing
- Bulk user import via CSV upload
- Revenue intelligence view

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS 4
- shadcn/ui + Radix UI primitives
- Axios
- React Hook Form + Zod
- Recharts
- Sonner + SweetAlert2 (toasts/dialogs)

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

```bash
git clone <your-repo-url>
cd NPPD_Gym_Admin_Frontend
npm install
```

Create `.env` in the project root:

```env
VITE_BACKEND_HOST=http://localhost:10000
```

Run the app:

```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173` by default.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## API Configuration

Axios is configured in `src/axios/axios-config.ts`:

- Base URL: `${VITE_BACKEND_HOST}/api`
- Falls back to `http://localhost:10000/api` if env var is missing
- Automatically attaches `Authorization: Bearer <token>` from `localStorage`

## Auth and Access Control

- Login page is available at `/`
- Protected routes validate token and restore user from `/auth/me`
- Allowed roles for dashboard routes: `superadmin`, `admin`
- Token is stored in `localStorage` key: `token`

## Route Map

- `/` - Login
- `/dashboard` - KPI dashboard
- `/gyms/create` - Create gym
- `/gyms/all` - View all gyms
- `/users/all` - View all users
- `/consultants/all` - View all consultants
- `/revenue` - Revenue intelligence
- `/user/create` - Create user
- `/users/upload` - CSV bulk user upload

## CSV Upload

Bulk upload UI is at `/users/upload`.

- Current parser supports CSV input (Excel-exported CSV works)
- Example file is available at `demo-users-upload.csv`
- Includes per-row validation and error reporting before submit

## Project Structure

```text
src/
├── axios/                # Axios instance and interceptors
├── components/           # Reusable UI + feature components
├── hooks/                # Typed redux hooks and utility hooks
├── lib/                  # Shared utilities and sidebar data
├── pages/                # Route-level pages
├── routes/               # Router configuration
├── store/                # Redux store and slices
├── types/                # Shared TypeScript types
└── utils/                # Toasts and helper utilities
```

## Deployment

- `vercel.json` is configured to rewrite all routes to `index.html`
- This enables client-side routing on refresh/direct URL access

## Notes

- Revenue page currently uses static sample data for member table/trend visualization.
- Gym list augments API response with temporary mock stats for dashboard-style cards.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
