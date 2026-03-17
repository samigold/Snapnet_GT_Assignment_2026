# Task 2 - Task Management API (In-Memory)

Simple Express API that implements the required task management endpoints and authorization rules.

## Tech Stack

- Node.js
- Express
- In-memory storage (no database)

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000` by default.

## Authentication Assumption

All routes require `x-user-id` header.

Example:

```http
x-user-id: 1
```

## Task Model

```json
{
  "id": 1,
  "title": "Complete assessment",
  "priority": "high",
  "status": "pending",
  "assignedTo": 2,
  "assignedBy": 1,
  "createdAt": "2026-03-09T12:00:00Z"
}
```

- `priority`: `low | medium | high`
- `status`: `pending | in-progress | completed`

## Endpoints

### 1. Create Task

`POST /tasks`

```json
{
  "title": "Complete assessment",
  "priority": "high",
  "assignedTo": 2,
  "assignedBy": 1
}
```

Notes:
- `assignedBy` must match `x-user-id`.
- New task is created with `status = "pending"`.

### 2. Get All Tasks

`GET /tasks`

Optional query params:
- `assignedTo`
- `status`

Example:

`GET /tasks?assignedTo=2&status=pending`

### 3. Update Task Details

`PATCH /tasks/:id`

Allowed fields:
- `title`
- `priority`

Only the assigner can call this route.

### 4. Update Task Status

`PATCH /tasks/:id/status`

```json
{
  "status": "in-progress"
}
```

Only the assignee can call this route.

### 5. Unassign Task

`PATCH /tasks/:id/unassign`

Only the assigner can call this route.

### 6. Assign Task

`PATCH /tasks/:id/assign`

```json
{
    "assigneeId" : 2
}
```

### 7. Delete Task

`DELETE /tasks/:id`

Only the assigner can call this route.

Returns `204 No Content` on success.

## HTTP Status Codes Used

- `201` Created task
- `200` Successful read/update/unassign
- `204` Successful delete
- `400` Validation errors
- `401` Missing authentication header
- `403` Forbidden action (wrong user)
- `404` Task/user/route not found
- `500` Unexpected server error
