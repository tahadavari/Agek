import { NextResponse } from "next/server";
import { subtaskSchema } from "@/lib/types";
import { addSubtask } from "@/lib/store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = subtaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = addSubtask(id, parsed.data.title, parsed.data.generatedBy, parsed.data.done);
  if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
