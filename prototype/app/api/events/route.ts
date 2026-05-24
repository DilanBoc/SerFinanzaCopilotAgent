import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const eventId = recordEvent(body.sessionId, body.eventType, body.payload ?? {}, {
    intent: body.intent,
    confidence: body.confidence,
    button: body.button,
    sourceIds: body.sourceIds,
  });
  return NextResponse.json({ eventId });
}
