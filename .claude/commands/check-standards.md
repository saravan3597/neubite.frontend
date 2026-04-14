Audit the file or feature specified in $ARGUMENTS for compliance with Neubite's frontend standards. If no target is given, ask the user which file or feature to audit.

Check for every item in this list and report pass/fail with the exact file and line for each failure:

**Colors & Styling**
- [ ] No raw hex values in JSX or Tailwind classes — only CSS variables from the palette (e.g. `text-text-primary`, `bg-accent-primary`)
- [ ] No inline `style={{ color: '#...' }}` or similar — use Tailwind only (exception: dynamic safe-area insets)
- [ ] No custom CSS files introduced outside `index.css`

**Mock mode**
- [ ] Every function that calls an external API checks `isMockMode()` before the call and returns mock data when true
- [ ] `isMockMode` is always imported from `src/shared/utils/mockMode.ts` — never re-implemented inline

**Auth**
- [ ] All Cognito/Amplify calls go through `src/features/auth/services/authService.ts` — no direct `aws-amplify` imports in components or stores
- [ ] JWT token is attached via the Axios interceptor in `axiosClient.ts`, not manually added to request headers

**TypeScript**
- [ ] No `any` types or `@ts-ignore` comments
- [ ] All component props have explicit interfaces defined
- [ ] All API response shapes have TypeScript interfaces

**Component design**
- [ ] UI components are pure — no direct API calls, no store mutations inside JSX
- [ ] Business logic lives in custom hooks or Zustand stores, not components

**Icons**
- [ ] All icons are imported from `src/shared/components/icons.tsx` — no one-off inline SVGs

After the audit, list all failures grouped by category and suggest the exact fix for each.
