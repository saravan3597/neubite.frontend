# Building API Clients from Swagger
When asked to update or build an API client:
1. Look at the provided `swagger.json` file.
2. Generate exact TypeScript interfaces for the DTOs and responses.
3. Create standard Axios service functions for the endpoints, ensuring the JWT interceptor is utilized.