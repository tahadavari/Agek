import { randomUUID } from "crypto";
import type { AgentType, Task, TaskStatus } from "@/lib/types";

const tasks = new Map<string, Task>();

export function listTasks() {
  return Array.from(tasks.values());
}

export function getTask(id: string) {
  return tasks.get(id);
}

export function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "logs" | "subtasks" | "comments" | "history">) {
  const now = new Date().toISOString();
  const created: Task = {
    ...task,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    logs: [],
    subtasks: [],
    comments: [],
    history: [{ id: randomUUID(), action: "task_created", actor: "system", at: now }]
  };
  tasks.set(created.id, created);
  return created;
}

export function updateTaskStatus(id: string, status: TaskStatus, actor: string) {
  const task = tasks.get(id);
  if (!task) return null;
  task.status = status;
  task.updatedAt = new Date().toISOString();
  task.history.push({ id: randomUUID(), action: "status_changed", actor, at: task.updatedAt, metadata: { status } });
  return task;
}

export function assignAgent(id: string, agent: AgentType, actor: string) {
  const task = tasks.get(id);
  if (!task) return null;
  task.assignedAgent = agent;
  task.updatedAt = new Date().toISOString();
  task.history.push({ id: randomUUID(), action: "agent_assigned", actor, at: task.updatedAt, metadata: { agent } });
  return task;
}

export function addComment(id: string, author: string, type: "ai" | "human", content: string) {
  const task = tasks.get(id);
  if (!task) return null;
  const createdAt = new Date().toISOString();
  task.comments.push({ id: randomUUID(), author, type, content, createdAt });
  task.updatedAt = createdAt;
  task.history.push({ id: randomUUID(), action: "comment_added", actor: author, at: createdAt, metadata: { type } });
  return task;
}

export function addSubtask(id: string, title: string, generatedBy: "ai" | "human", done = false) {
  const task = tasks.get(id);
  if (!task) return null;
  task.subtasks.push({ id: randomUUID(), title, generatedBy, done });
  task.updatedAt = new Date().toISOString();
  task.history.push({ id: randomUUID(), action: "subtask_added", actor: generatedBy, at: task.updatedAt });
  return task;
}

export function appendLog(id: string, line: string) {
  const task = tasks.get(id);
  if (!task) return null;
  task.logs.push(line);
  task.updatedAt = new Date().toISOString();
  return task;
}

export function pushHistory(id: string, action: string, actor: string, metadata?: Record<string, unknown>) {
  const task = tasks.get(id);
  if (!task) return null;
  task.history.push({ id: randomUUID(), action, actor, at: new Date().toISOString(), metadata });
  return task;
}
