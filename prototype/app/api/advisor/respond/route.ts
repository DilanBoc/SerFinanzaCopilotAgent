import { NextResponse } from "next/server";
import { answers } from "@/lib/demo-data";
import { recordEvent } from "@/lib/db";
import type { Intent } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { sessionId: string; intent: Intent; question: string };
  const answer = answers[body.intent];

  if (!answer) {
    return NextResponse.json(
      {
        summary: "No hay informacion suficiente en la base documental vigente.",
        script: "Este caso debe escalarse para validacion antes de responder al cliente.",
        checklist: ["Escalar a supervisor o area responsable.", "Registrar brecha de conocimiento."],
        recommendedChannel: "Validacion interna",
        requiredDocuments: [],
        warnings: ["No responder de fondo sin fuente aprobada."],
        nextBestAction: "Escalar y registrar brecha.",
        sources: [],
      },
      { status: 200 },
    );
  }

  recordEvent(
    body.sessionId,
    "ANSWER_SHOWN",
    { question: body.question, answer },
    { intent: body.intent, sourceIds: answer.sources.map((source) => source.id) },
  );

  return NextResponse.json(answer);
}
