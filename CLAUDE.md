# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build
```

Tests use Vitest:
```bash
npx vitest           # Run all tests
npx vitest run       # Run once (CI mode)
npx vitest run src/features/recipes  # Run tests in a specific directory
```

## Architecture

This is a meal-planning/recipe-suggestion app built with React 19, TypeScript, Vite, and AWS Cognito auth.

**App bootstrap flow:**
`main.tsx` → `App.tsx` (Amplify config + session check) → `RouterProvider` → `ProtectedRoute` → `Layout.tsx` (sidebar/header) → page `Outlet`

**Routing** (`src/app/router.tsx`): React Router v7. `/` redirects to `/dashboard`. Routes: `/login`, `/dashboard`, `/pantry`. `ProtectedRoute` guards authenticated pages.

**State management** (`src/shared/stores/`): Zustand with `persist` middleware (localStorage). Three stores:
- `useAuthStore` — current user, session, login/logout
- `useRecipeStore` — saved/favorited recipes
- `useGroceryPantryStore` — grocery list and pantry inventory

**API layer** (`src/shared/api/axiosClient.ts`): Axios with base URL from `VITE_API_URL` env var (falls back to `http://localhost:3000/api`). A request interceptor automatically attaches the Cognito JWT Bearer token from `useAuthStore`. A 401 interceptor logs the user out.

**Auth** (`src/features/auth/services/authService.ts`): All AWS Cognito interactions are wrapped here using `aws-amplify`. Amplify is configured in `App.tsx` using the Cognito User Pool ID and App Client ID.

**Feature organization** — Feature-Sliced Design under `src/features/[name]/`:
```
features/
  auth/services/        # Cognito auth wrappers
  signup/               # Sign-up form + Zustand store
  recipes/
    components/         # UI components
    hooks/              # useRecipeSuggestions, etc.
    services/           # recipeAiService (time-of-day logic, suggestions)
    types/              # Recipe, Ingredient, NutritionalData interfaces
    mocks/              # Mock data
  grocery/components/
  pantry/
```

## Code Standards

- **TypeScript**: Strict mode. Never use `any` or `ts-ignore`. Define interfaces for all props, API responses, and state.
- **Styling**: Tailwind CSS only. No inline styles or custom CSS files (except `index.css` for global theme vars).
- **Components**: Keep UI components pure — move business logic into custom hooks.
- **State**: Use Zustand for global state; keep stores modular.
- **Auth**: All Cognito interactions must go through `AuthService` — never call `aws-amplify` directly from components or stores.
- **API calls**: Use the Axios client; never `fetch` directly. Read env vars via `import.meta.env`, never hardcode them.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |

AWS Cognito config (User Pool ID, App Client ID) is currently hardcoded in `App.tsx` — move to env vars before production.
