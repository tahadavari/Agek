"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { statuses, type Task, type TaskStatus } from "@/lib/types";

const labels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done"
};

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const grouped = useMemo(
    () =>
      statuses.reduce(
        (acc, status) => {
          acc[status] = tasks.filter((t) => t.status === status);
          return acc;
        },
        {} as Record<TaskStatus, Task[]>
      ),
    [tasks]
  );

  async function moveTask(taskId: string, status: TaskStatus) {
    const response = await fetch(`/api/tasks/${taskId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) return;
    const payload = await response.json();
    setTasks((prev) => prev.map((task) => (task.id === taskId ? payload.data : task)));
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {statuses.map((status) => (
        <section
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(event) => {
            const taskId = event.dataTransfer.getData("taskId");
            if (taskId) void moveTask(taskId, status);
          }}
          className="rounded-xl border border-border bg-muted/40 p-3"
        >
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">{labels[status]}</h2>
          <div className="space-y-2">
            {grouped[status].map((task) => (
              <Card
                key={task.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("taskId", task.id)}
                className="cursor-move p-3"
              >
                <p className="text-sm font-medium">{task.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{task.description}</p>
                <div className="mt-2 text-xs text-slate-500">{task.assignedAgent}</div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
