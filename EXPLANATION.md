## How I approached the implementation

I started by reading the requirements and business rules, then mapped each rule to an endpoint behavior.

I then implemented the API in small steps:

   - Set up the Express project and basic server.
   - Added in-memory storage for tasks and sample users for validation checks.
   - Built validation for request body, params, and query values.
   - Implemented service logic for each endpoint.
   - Added authorization checks based on x-user-id to enforce assigner/assignee permissions.
   - Added centralized error handling and proper HTTP status codes.
   - Added README usage examples and tested endpoints with Postman/curl.

This helped me ensure each requirement was covered before moving to the next one.

### Why I structured the code the way I did

I used a simple layered structure to keep responsibilities clear:

    - routes/: defines endpoint URLs and calls logic.
    - services/: contains business rules and task operations.
    - middleware/: handles cross-cutting concerns like auth and error handling.
    - utils/: reusable helpers (validation and HTTP error class).
    - data/: in-memory store.

I chose this structure because it keeps controllers/routes thin, seperation of concerns which makes business logic easier to test and maintain, and avoids mixing validation/auth/business logic in one file.

### Assumptions I made

- Authentication is simulated using x-user-id header.
- assignedBy in create request must match x-user-id (to prevent impersonation).
- Users are represented as a small in-memory list ([1,2,3,4,5]) only for assignment checks.
- Tasks are stored in memory, so data resets when server restarts.
- PATCH /tasks/:id allows only title and/or priority.
- PATCH /tasks/:id/status allows only status.
- Unassign sets assignedTo to null and resets status to pending.

### What I would improve if given more time

- Replace in-memory storage with a real database (PostgreSQL/MongoDB).
- Add pagination, sorting, and richer filtering to GET /tasks.
- Add logging/observability (structured logs, request IDs, metrics).
- Add rate limiting and security headers.
- Add API documentation with OpenAPI/Swagger.
- Improve user/auth model (JWT/session + real users table).

### Tools or AI assistance used

I Used Postman for endpoint testing.
Used AI assistance (GitHub Copilot/ChatGPT-style support) for guidance on:
 - endpoint response design,
 - drafting explanations/documentation.
I reviewed and adjusted outputs to match the assessment requirements and my own understanding.