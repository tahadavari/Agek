import { spawn } from "child_process";
import { appendLog, pushHistory, updateTaskStatus } from "@/lib/store";
import type { AgentType, Task } from "@/lib/types";

const agentCommands: Record<AgentType, string> = {
  claude_code: "claude",
  codex_cli: "codex",
  gemini_cli: "gemini",
  cursor_cli: "cursor",
  openclaw_cli: "openclaw",
  custom: process.env.DEFAULT_CUSTOM_AGENT_COMMAND ?? "echo"
};

export async function dispatchTaskToAgent(task: Task) {
  const command = agentCommands[task.assignedAgent];
  updateTaskStatus(task.id, "in_progress", "scheduler");
  pushHistory(task.id, "dispatch_started", "scheduler", { command });

  return new Promise<void>((resolve) => {
    const child = spawn(command, [task.title], { shell: true });

    child.stdout.on("data", (data) => appendLog(task.id, data.toString()));
    child.stderr.on("data", (data) => appendLog(task.id, `[stderr] ${data.toString()}`));

    child.on("close", (code) => {
      pushHistory(task.id, "dispatch_finished", "scheduler", { code });
      updateTaskStatus(task.id, code === 0 ? "review" : "todo", "scheduler");
      resolve();
    });
  });
}
