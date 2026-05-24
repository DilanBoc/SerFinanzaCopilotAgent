import { NextResponse } from "next/server";
import { createGap, listGaps } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ gaps: listGaps() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const gapId = createGap({
    sessionId: body.sessionId,
    intent: body.intent,
    topic: body.topic,
    questionText: body.questionText,
    sourceIds: body.sourceIds ?? [],
  });
  return NextResponse.json({ gapId });
}
