import { NextResponse } from "next/server";
import { transcript } from "@/lib/demo-data";
import { createSession } from "@/lib/db";

export const runtime = "nodejs";

export async function POST() {
  const transcriptText = transcript.map((line) => `${line.speaker}: ${line.text}`).join("\n");
  const sessionId = createSession(transcriptText);
  return NextResponse.json({ sessionId });
}
