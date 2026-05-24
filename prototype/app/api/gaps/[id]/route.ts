import { NextResponse } from "next/server";
import { updateGapStatus } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  updateGapStatus(id, body.status);
  return NextResponse.json({ ok: true });
}
