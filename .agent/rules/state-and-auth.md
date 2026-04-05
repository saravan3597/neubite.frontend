---
trigger: always_on
---

# State & Security
- Use Zustand for global state. Keep stores modular.
- All AWS Cognito interactions must happen inside a dedicated `AuthService`.
- Use Axios for API calls. Automatically attach the Cognito JWT Bearer token to all outgoing requests via an Axios interceptor.
- Never hardcode environment variables. Read from `import.meta.env`.