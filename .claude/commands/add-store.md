Create a new Zustand store for the feature specified in $ARGUMENTS. Ask for the feature name if not provided.

Rules:
1. Place the store at `src/shared/stores/use[Feature]Store.ts`
2. Always use `create<State>()` with an explicit TypeScript interface — no `any`
3. If the store needs to persist across page reloads, wrap with `persist` middleware and set a unique `name` key (e.g. `'neubite-[feature]'`)
4. If bumping an existing store's schema (adding/removing persisted fields), increment `version` by 1 to force a localStorage reset
5. Include a `loadFromServer` async action that:
   - Returns immediately if `isMockMode()` is true (import from `src/shared/utils/mockMode.ts`)
   - Calls the relevant API module from `src/shared/api/`
   - Catches errors silently and falls back to existing state (never crashes on server unavailability)
6. Any action that writes to the server should optimistically update local state first, then fire-and-forget the API call with `.catch(() => undefined)`
7. Never call `aws-amplify` or touch auth state from within a non-auth store
