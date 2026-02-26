import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/store";
import { taskSchema } from "@/lib/types";
import { startScheduler } from "@/lib/scheduler";

startScheduler();

export async function GET() {
  return NextResponse.json({ data: listTasks() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const task = createTask(parsed.data);
  return NextResponse.json({ data: task }, { status: 201 });
}
