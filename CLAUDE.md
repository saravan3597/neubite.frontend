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

Mobile (Capacitor — requires `npm run build` first):
```bash
npx cap sync ios     # Sync web build to iOS project
npx cap open ios     # Open in Xcode
npx cap sync android
npx cap open android
```

## Architecture

This is a meal-planning/recipe-suggestion app built with React 19, TypeScript, Vite, and AWS Cognito auth. It also targets iOS/Android via Capacitor.

**App bootstrap flow:**
`main.tsx` → `App.tsx` (Amplify config + all store hydration) → `RouterProvider` → `ProtectedRoute` → `Layout.tsx` (sidebar/header) → page `Outlet`

On mount, `App.tsx` calls `checkSession()`, `loadFromServer()` for grocery/pantry, and `loadFromServer()` for saved recipes in parallel.

**Routing** (`src/app/router.tsx`): React Router v7. `/` redirects to `/dashboard`. Routes: `/login`, `/dashboard`, `/pantry`. `ProtectedRoute` guards authenticated pages.

**State management** (`src/shared/stores/`): Zustand with `persist` middleware (localStorage). Three stores:
- `useAuthStore` — current user, session, login/logout; calls `authService.ts` (real Amplify calls)
- `useRecipeStore` — saved/favorited recipes; persisted as `neubite-saved-recipes`
- `useGroceryPantryStore` — grocery list and pantry inventory; persisted as `neubite-grocery-pantry`. Also exposes `consumeIngredients()` to deduct pantry quantities after using a recipe.

**API layer** (`src/shared/api/`): Axios client (`axiosClient.ts`) with base URL from `VITE_API_URL`. A request interceptor attaches the Cognito JWT from `useAuthStore`; a 401 interceptor auto-logs out. Specific modules: `groceryApi.ts`, `pantryApi.ts`, `savedRecipesApi.ts`.

**Auth** (`src/features/auth/services/authService.ts`): All AWS Cognito interactions via `aws-amplify`. Amplify is configured in `App.tsx` using `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID`. Note: `src/shared/services/AuthService.ts` is an unused stub — do not use it.

**Feature organization** — Feature-Sliced Design under `src/features/[name]/`:
```
features/
  auth/services/        # Cognito auth wrappers (real implementation)
  signup/               # Sign-up form + Zustand store
  recipes/
    components/         # UI components
    hooks/              # useRecipeSuggestions (time-of-day logic)
    services/           # recipeAiService — calls VITE_AI_API_URL
    types/              # Recipe, Ingredient, NutritionalData interfaces
    mocks/              # Mock data for development
  grocery/components/   # GroceryListSection, PantrySection, IntakeModal
  pantry/
```

## Code Standards

- **TypeScript**: Strict mode. Never use `any` or `ts-ignore`. Define interfaces for all props, API responses, and state.
- **Styling**: Tailwind CSS only. No inline styles or custom CSS files (except `index.css` for global theme vars).
- **Components**: Keep UI components pure — move business logic into custom hooks.
- **State**: Use Zustand for global state; keep stores modular.
- **Auth**: All Cognito interactions must go through `features/auth/services/authService.ts` — never call `aws-amplify` directly from components or stores.
- **API calls**: Use the Axios client; never `fetch` directly. Read env vars via `import.meta.env`, never hardcode them.

## Environment Variables

Copy `.env.example` to `.env` to get started.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_AI_API_URL` | Recipe AI/LLM endpoint |
| `VITE_COGNITO_USER_POOL_ID` | AWS Cognito User Pool ID (e.g. `us-east-2_xxx`) |
| `VITE_COGNITO_CLIENT_ID` | AWS Cognito App Client ID |
