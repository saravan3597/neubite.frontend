Ask the user for the feature name. Then create a folder at `src/features/[name]` containing:
- `index.ts` — re-exports for the feature's public API
- A main component file (`[Name].tsx`) — pure UI component, no business logic
- A `.test.tsx` file with basic rendering tests using Vitest
- A dedicated Zustand store (`use[Name]Store.ts`) if the feature requires global state

Follow the project's Feature-Sliced Design structure. Use strict TypeScript (no `any`), Tailwind CSS for styling, and the project's CSS variable color palette.
