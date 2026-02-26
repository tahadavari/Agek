import { dispatchTaskToAgent } from "@/lib/agent-runner";
import { listTasks } from "@/lib/store";

let started = false;

export function startScheduler() {
  if (started) return;
  started = true;

  setInterval(async () => {
    const now = Date.now();
    const runnable = listTasks().filter((task) => {
      const due = new Date(task.startTime).getTime() <= now;
      const blocked = ["in_progress", "review", "done"].includes(task.status);
      return due && !blocked;
    });

    for (const task of runnable) {
      await dispatchTaskToAgent(task);
    }
  }, 5_000);
}
