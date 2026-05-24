"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Eye, Flag, HelpCircle, Mic, ShieldCheck, X } from "lucide-react";
import { ActionButton, Badge, Panel } from "@/components/ui";
import { advisor, customer, detectedQuestions, office, transcript } from "@/lib/demo-data";
import type { AdvisorAction, DetectedQuestion, StructuredAnswer, TranscriptLine } from "@/lib/types";

const actionMap: Record<AdvisorAction, { label: string; icon: typeof CheckCircle2 }> = {
  KNOW: { label: "Lo se", icon: CheckCircle2 },
  VIEW_ANSWER: { label: "Ver respuesta", icon: Eye },
  ESCALATE: { label: "Escalar", icon: Flag },
  IGNORE: { label: "Ignorar", icon: X },
};

export default function AdvisorPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [lineCount, setLineCount] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<DetectedQuestion | null>(null);
  const [answer, setAnswer] = useState<StructuredAnswer | null>(null);
  const [notice, setNotice] = useState("Demo lista para iniciar");

  const visibleLines = useMemo(() => transcript.slice(0, lineCount), [lineCount]);

  useEffect(() => {
    fetch("/api/session/start", { method: "POST" })
      .then((response) => response.json())
      .then((data) => setSessionId(data.sessionId))
      .catch(() => setNotice("No se pudo iniciar sesion local"));
  }, []);

  function advance() {
    const nextCount = Math.min(lineCount + 1, transcript.length);
    setLineCount(nextCount);
    setAnswer(null);
    const detected = detectedQuestions.find((question) => question.lineIndex === nextCount - 1) ?? null;
    setActiveQuestion(detected);
    if (detected && sessionId) {
      setNotice(`Pregunta detectada: ${detected.topic}`);
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType: "QUESTION_DETECTED",
          intent: detected.intent,
          confidence: detected.confidence,
          payload: detected,
        }),
      });
    }
  }

  async function selectAction(action: AdvisorAction) {
    if (!activeQuestion || !sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: action,
        payload: { questionId: activeQuestion.id, fragment: activeQuestion.fragment },
      }),
    });

    if (action === "VIEW_ANSWER") {
      const response = await fetch("/api/advisor/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, intent: activeQuestion.intent, question: activeQuestion.fragment }),
      });
      setAnswer(await response.json());
      setNotice("Respuesta estructurada generada");
    } else if (action === "ESCALATE") {
      setNotice("Caso marcado como riesgo operacional para validacion");
    } else if (action === "IGNORE") {
      setNotice("Deteccion marcada como falso positivo");
      setActiveQuestion(null);
    } else {
      setNotice("Asesor confirma dominio del tema");
      setActiveQuestion(null);
    }
  }

  async function markResolved() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "RESOLVED",
        intent: activeQuestion.intent,
        payload: { questionId: activeQuestion.id },
      }),
    });
    setNotice("Consulta marcada como resuelta");
    setActiveQuestion(null);
    setAnswer(null);
  }

  async function reportGap() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/gaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        intent: activeQuestion.intent,
        topic: activeQuestion.topic,
        questionText: activeQuestion.fragment,
        sourceIds: answer?.sources.map((source) => source.id) ?? [],
      }),
    });
    setNotice("Brecha registrada para administrador");
    setActiveQuestion(null);
    setAnswer(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr_380px]">
      <aside className="space-y-4">
        <Panel title="Atencion presencial">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Microfono</span>
              <Badge tone="success">
                <span className="flex items-center gap-1">
                  <Mic size={13} /> Escuchando
                </span>
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Consentimiento</span>
              <Badge tone="brand">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} /> Aviso visible
                </span>
              </Badge>
            </div>
            <div className="rounded bg-surface p-3">
              <p className="font-medium">{advisor.name}</p>
              <p className="text-muted">{advisor.seniority}</p>
              <p className="text-muted">{office.name}</p>
            </div>
            <div className="rounded bg-surface p-3">
              <p className="font-medium">{customer.name}</p>
              <p className="text-muted">{customer.segment}</p>
              <p className="text-muted">Canal preferido: {customer.preferredChannel}</p>
              <p className="text-muted">Score simulado: {customer.simulatedScore}</p>
            </div>
          </div>
        </Panel>
        <Panel title="Control demo">
          <div className="space-y-3">
            <ActionButton onClick={advance} disabled={lineCount >= transcript.length}>
              Avanzar conversacion
            </ActionButton>
            <p className="text-sm text-muted">{notice}</p>
          </div>
        </Panel>
      </aside>

      <section className="space-y-4">
        <Panel title="Transcripcion en vivo simulada">
          <div className="min-h-[520px] space-y-3">
            {visibleLines.map((line: TranscriptLine, index) => (
              <div key={`${line.speaker}-${index}`} className="rounded border border-line bg-surface p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">{line.speaker}</p>
                <p className="mt-1 leading-6">{line.text}</p>
              </div>
            ))}
            {visibleLines.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center rounded border border-dashed border-line text-muted">
                Inicia la conversacion para activar el copiloto.
              </div>
            ) : null}
          </div>
        </Panel>
      </section>

      <aside className="space-y-4">
        <Panel title="Copiloto contextual">
          {activeQuestion ? (
            <div className="space-y-4">
              <div className="rounded border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <CircleDot className="mt-1 text-brand" size={17} />
                  <div>
                    <p className="font-medium text-ink">{activeQuestion.topic}</p>
                    <p className="mt-1 text-sm text-muted">{activeQuestion.fragment}</p>
                    <p className="mt-2 text-xs text-muted">Confianza: {Math.round(activeQuestion.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(actionMap) as AdvisorAction[]).map((key) => {
                  const Icon = actionMap[key].icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectAction(key)}
                      className="focus-ring flex items-center justify-center gap-2 rounded border border-line bg-white px-3 py-2 text-sm hover:bg-surface"
                    >
                      <Icon size={15} />
                      {actionMap[key].label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[190px] items-center justify-center rounded border border-dashed border-line text-center text-sm text-muted">
              El copiloto mostrara una tarjeta cuando detecte una pregunta bancaria.
            </div>
          )}
        </Panel>

        {answer ? (
          <Panel
            title="Respuesta estructurada"
            action={
              answer.warnings.length ? (
                <Badge tone="warn">
                  <AlertTriangle size={13} /> Advertencia
                </Badge>
              ) : null
            }
          >
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Resumen</p>
                <p className="mt-1 text-muted">{answer.summary}</p>
              </div>
              <div>
                <p className="font-medium">Guion sugerido</p>
                <p className="mt-1 rounded bg-surface p-3 leading-6">{answer.script}</p>
              </div>
              <div>
                <p className="font-medium">Checklist</p>
                <ul className="mt-2 space-y-1 text-muted">
                  {answer.checklist.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 text-accent" size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Siguiente mejor accion</p>
                <p className="mt-1 text-muted">{answer.nextBestAction}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {answer.sources.map((source) => (
                  <Badge key={source.id} tone="brand">
                    {source.label}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ActionButton onClick={markResolved}>Marcar resuelto</ActionButton>
                <ActionButton onClick={reportGap} variant="secondary">
                  Reportar brecha
                </ActionButton>
              </div>
            </div>
          </Panel>
        ) : null}
      </aside>
    </div>
  );
}
