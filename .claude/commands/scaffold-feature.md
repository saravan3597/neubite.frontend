Scaffold a new feature following Neubite's Feature-Sliced Design structure. Ask for the feature name if not provided in $ARGUMENTS.

Create the following under `src/features/[name]/`:

```
[name]/
  components/     # Pure UI components — no API calls, no store mutations
  hooks/          # Custom hooks — business logic, data fetching, derived state
  services/       # API calls and external integrations
  types/          # TypeScript interfaces and types for this feature
  mocks/          # Mock data and mock service functions for demo mode
  index.ts        # Re-exports for the feature's public API
```

For each file created, follow these rules:

**components/[Name].tsx**
- Pure UI only — accept props, render, emit events via callbacks
- Use only CSS variables from the color palette (no raw hex values)
- Import icons exclusively from `src/shared/components/icons.tsx`

**hooks/use[Name].ts**
- All data fetching and state logic lives here, not in components
- Always check `isMockMode()` (from `src/shared/utils/mockMode.ts`) before any API call
- Return mock data from `mocks/` when mock mode is active

**services/[name]Api.ts**
- Use `axiosClient` from `src/shared/api/axiosClient.ts` — never raw `fetch`
- Never hardcode URLs — use `import.meta.env.VITE_API_URL`

**types/[name].types.ts**
- Define all interfaces here — no inline type definitions in components or hooks

**mocks/[name]Mocks.ts**
- Export seed/mock data arrays that match the TypeScript interfaces exactly
- Mock functions should simulate realistic latency with `await new Promise(r => setTimeout(r, 600))`

After scaffolding, add the feature's route to `src/app/router.tsx` and the nav link to `src/app/Layout.tsx` if it needs a top-level page.
