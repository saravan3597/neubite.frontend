Build or update an API client module from a Swagger/OpenAPI spec. Steps:
1. Read the provided `swagger.json` (or ask the user for the path/URL if not specified)
2. Generate exact TypeScript interfaces for all DTOs and response shapes
3. Create standard Axios service functions for each endpoint, using the existing `axiosClient` from `src/shared/api/axiosClient.ts` so the JWT interceptor is automatically applied
4. Place the output in `src/shared/api/` as a new module (e.g., `[resource]Api.ts`), following the existing pattern of `groceryApi.ts`, `pantryApi.ts`, and `savedRecipesApi.ts`
5. Never use `fetch` directly and never hardcode base URLs — always rely on `axiosClient` and `import.meta.env`
