Create a temporary mock function for a backend endpoint. The mock must:
1. Return a `Promise` that resolves to dummy data matching the relevant TypeScript interface
2. Use `setTimeout` to simulate realistic network latency (e.g., 600–900ms)
3. Be placed alongside the real API module in `src/shared/api/` or the relevant feature's `services/` folder
4. Be clearly named with a `mock` prefix so it's easy to swap out for the real implementation later

Ask the user which endpoint and TypeScript interface to mock if not specified.
