import { NextResponse } from "next/server";
import { getTask } from "@/lib/store";
import { dispatchTaskToAgent } from "@/lib/agent-runner";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = getTask(id);
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  await dispatchTaskToAgent(task);
  return NextResponse.json({ data: task });
}
