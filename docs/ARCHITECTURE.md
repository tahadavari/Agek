# Agek Kanban - Production Architecture Blueprint

## 1) Project Architecture

```text
app/
  api/
    mcp/route.ts
    tasks/
      route.ts
      [id]/
        move/route.ts
        comments/route.ts
        subtasks/route.ts
        assign-agent/route.ts
        dispatch/route.ts
  layout.tsx
  page.tsx
components/
  kanban-board.tsx
  ui/
    button.tsx
    card.tsx
lib/
  agent-runner.ts
  scheduler.ts
  store.ts
  types.ts
  utils.ts
prisma/
  schema.prisma
docs/
  ARCHITECTURE.md
```

## 2) Database Schema Design

- `Task`: title, description, assigned agent, status, start time, logs.
- `Subtask`: linked to task, AI/manual marker, completion state.
- `Comment`: linked to task, AI/human marker, structured body.
- `TaskHistory`: immutable event stream for all actions.
- `AgentExecution`: command execution result, stderr/stdout, exit code.

See Prisma schema in `prisma/schema.prisma`.

## 3) API Structure (MCP-friendly)

### Core endpoints
- `GET /api/tasks`
- `POST /api/tasks`
- `POST /api/tasks/{id}/move`
- `POST /api/tasks/{id}/comments`
- `POST /api/tasks/{id}/subtasks`
- `POST /api/tasks/{id}/assign-agent`
- `POST /api/tasks/{id}/dispatch`
- `GET /api/mcp` capability declaration

### MCP design
All endpoints accept/return JSON with deterministic shapes:

```json
{ "data": { "id": "task-id", "status": "review" } }
```

Validation is implemented with Zod schemas.

## 4) UI Structure

- `app/page.tsx`: dashboard shell and board container.
- `components/kanban-board.tsx`: 5-column drag-and-drop kanban.
- `components/ui/*`: shadcn-style minimal primitives.

## 5) Core Implementation Examples

- Scheduler loop: `lib/scheduler.ts` polls due tasks every 5s.
- CLI dispatch: `lib/agent-runner.ts` maps agent type -> shell command and captures logs.
- Activity history: stored as append-only events in each task object.

## 6) Example Agent Execution Flow

1. Task created with `startTime` + `assignedAgent`.
2. Scheduler detects task is due.
3. Runner starts CLI process (`spawn`).
4. Stdout/stderr appended to task logs.
5. Task moved to `review` on success or `todo` on failure.
6. History events recorded (`dispatch_started`, `dispatch_finished`, status updates).

## 7) Extensibility

- Add new agent type by extending `agentTypes` + `agentCommands`.
- Replace in-memory store with Prisma repository.
- Add websocket/event bus for real-time board updates.
- Add auth and tenant scope with middleware.
