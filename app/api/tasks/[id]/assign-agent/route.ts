import { NextResponse } from "next/server";
import { z } from "zod";
import { assignAgent } from "@/lib/store";
import { agentTypes } from "@/lib/types";

const schema = z.object({ agent: z.enum(agentTypes) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = assignAgent(id, parsed.data.agent, "api");
  if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}
