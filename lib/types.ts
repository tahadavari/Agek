import { z } from "zod";

export const statuses = ["backlog", "todo", "in_progress", "review", "done"] as const;
export type TaskStatus = (typeof statuses)[number];

export const agentTypes = ["claude_code", "codex_cli", "gemini_cli", "cursor_cli", "openclaw_cli", "custom"] as const;
export type AgentType = (typeof agentTypes)[number];

export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().default(""),
  assignedAgent: z.enum(agentTypes).default("codex_cli"),
  startTime: z.string().datetime(),
  status: z.enum(statuses).default("backlog")
});

export const moveTaskSchema = z.object({
  status: z.enum(statuses)
});

export const commentSchema = z.object({
  author: z.string().min(1),
  type: z.enum(["ai", "human"]),
  content: z.string().min(1)
});

export const subtaskSchema = z.object({
  title: z.string().min(1),
  generatedBy: z.enum(["ai", "human"]),
  done: z.boolean().default(false)
});

export type Task = z.infer<typeof taskSchema> & {
  id: string;
  logs: string[];
  subtasks: Array<z.infer<typeof subtaskSchema> & { id: string }>;
  comments: Array<z.infer<typeof commentSchema> & { id: string; createdAt: string }>;
  history: Array<{ id: string; action: string; actor: string; at: string; metadata?: Record<string, unknown> }>;
  createdAt: string;
  updatedAt: string;
};
