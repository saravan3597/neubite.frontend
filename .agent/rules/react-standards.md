---
trigger: always_on
---

# React & UI Architecture
- Enforce strict TypeScript. Never use `any` or `ts-ignore`. Define interfaces for all component props, API responses, and state objects.
- Group files by Feature-Sliced Design (e.g., `src/features/recipes`, `src/features/pantry`) rather than by technical type.
- Use Tailwind CSS exclusively. Avoid inline styles or custom CSS files.
- Keep UI components pure. Offload heavy business logic to custom hooks.