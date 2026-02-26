import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    protocol: "mcp",
    version: "1.0",
    tools: [
      { name: "create_task", endpoint: "POST /api/tasks" },
      { name: "create_subtask", endpoint: "POST /api/tasks/{id}/subtasks" },
      { name: "add_comment", endpoint: "POST /api/tasks/{id}/comments" },
      { name: "move_task", endpoint: "POST /api/tasks/{id}/move" },
      { name: "assign_agent", endpoint: "POST /api/tasks/{id}/assign-agent" },
      { name: "dispatch_task", endpoint: "POST /api/tasks/{id}/dispatch" }
    ]
  });
}
