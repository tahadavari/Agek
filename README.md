# Agek - Agentic Kanban Platform

A modern, MCP-friendly Kanban platform built with **Next.js App Router**, **TypeScript**, and clean component architecture for orchestrating CLI-based AI agents.

## Features

- 5-column Kanban board: Backlog, Todo, In Progress, Review, Done
- Drag-and-drop task movement
- Task model with:
  - title, description, assigned agent, scheduled start time, status
  - subtasks
  - comments
  - activity history
  - execution logs
- Scheduler that auto-dispatches due tasks to assigned CLI agents
- MCP-friendly JSON API surface for external AI automation

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API overview

- `GET /api/tasks`
- `POST /api/tasks`
- `POST /api/tasks/:id/move`
- `POST /api/tasks/:id/comments`
- `POST /api/tasks/:id/subtasks`
- `POST /api/tasks/:id/assign-agent`
- `POST /api/tasks/:id/dispatch`
- `GET /api/mcp`

## Architecture

See `docs/ARCHITECTURE.md` for project architecture, database design, API contracts, and execution flow.
