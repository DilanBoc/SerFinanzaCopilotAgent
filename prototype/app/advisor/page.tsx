"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Eye,
  Flag,
  Mic,
  Radio,
  Pause,
  Play,
  Search,
  Zap,
  X,
  User,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  ChevronRight,
  MessageSquare,
  BarChart,
  Lightbulb,
  Shield,
} from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { ActionButton, Badge, Panel } from "@/components/ui";
import { detectConsultation } from "@/lib/consultation-detector";
import { advisor, detectedQuestions, office, transcript } from "@/lib/demo-data";
import type { CustomerProfile, DetectedQuestion, StructuredAnswer, TranscriptLine } from "@/lib/types";

type WorkdayState = "off" | "active" | "paused";
type AttentionState = "idle" | "customer_loaded" | "in_attention";
type TranscriptMode = "microphone"; // Removed "simulated" choice as requested
type VoiceStatus = "idle" | "connecting" | "connected" | "error";

const VOICE_AGENT_URL = "ws://localhost:8765/ws/transcript";

export default function AdvisorPage() {
  const [workday, setWorkday] = useState<WorkdayState>("off");
  const [attention, setAttention] = useState<AttentionState>("idle");
  const [documentId, setDocumentId] = useState("1045678901");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerError, setCustomerError] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [lineCount, setLineCount] = useState(0);
  const [liveLines, setLiveLines] = useState<TranscriptLine[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [activeQuestion, setActiveQuestion] = useState<DetectedQuestion | null>(null);
  const [answer, setAnswer] = useState<StructuredAnswer | null>(null);
  const [notice, setNotice] = useState("BOCA LISTO.");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const visibleLines = liveLines; // Only live lines now
  const copilotActive = workday === "active" && attention === "in_attention";

  useEffect(() => {
    if (!copilotActive) {
      setVoiceStatus("idle");
      return;
    }

    setVoiceStatus("connecting");
    const socket = new WebSocket(VOICE_AGENT_URL);

    socket.onopen = () => {
      setVoiceStatus("connected");
      setNotice("VOZ ACTIVA. BOCA ESCUCHANDO.");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== "transcript" || typeof message.text !== "string") return;
        ingestLiveTranscript(message.text);
      } catch {
        setNotice("ERROR DE VOZ.");
      }
    };

    socket.onerror = () => {
      setVoiceStatus("error");
      setNotice("MICRÓFONO NO DISPONIBLE.");
    };

    socket.onclose = () => {
      setVoiceStatus((current) => current === "connected" ? "idle" : current);
    };

    return () => socket.close();
  }, [copilotActive, sessionId]);

  async function searchCustomer() {
    setCustomerError("");
    setSelectedCustomer(null);
    const response = await fetch(`/api/customers/${encodeURIComponent(documentId.trim())}`);
    if (!response.ok) {
      setCustomerError("NO ENCONTRADO.");
      setAttention("idle");
      return;
    }
    const data = await response.json();
    setSelectedCustomer(data.customer);
    setAttention("customer_loaded");
    setNotice("CLIENTE IDENTIFICADO.");
  }

  async function startAttention() {
    if (!selectedCustomer || workday !== "active") return;
    const response = await fetch("/api/session/start", { method: "POST" });
    const data = await response.json();
    setSessionId(data.sessionId);
    setAttention("in_attention");
    setLineCount(0);
    setLiveLines([]);
    setAnswer(null);
    setActiveQuestion(null);
    setNotice("ESCANEANDO CONTEXTO...");
  }

  function finishAttention() {
    setAttention(selectedCustomer ? "customer_loaded" : "idle");
    setSessionId("");
    setLineCount(0);
    setLiveLines([]);
    setAnswer(null);
    setActiveQuestion(null);
    setVoiceStatus("idle");
    setNotice("SESIÓN FINALIZADA.");
  }

  function ingestLiveTranscript(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setAnswer(null);
    setLiveLines((currentLines) => {
      const nextLines = [...currentLines, { speaker: "Cliente", text: cleanText } satisfies TranscriptLine];
      const detected = detectConsultation(cleanText, nextLines.length - 1);
      setActiveQuestion(detected);

      if (detected && sessionId) {
        setNotice(`DETECTADO: ${detected.topic.toUpperCase()}`);
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            eventType: "QUESTION_DETECTED",
            intent: detected.intent,
            confidence: detected.confidence,
            payload: { ...detected, trigger: detected.fragment, source: "local-whisper" },
          }),
        });
      }

      return nextLines;
    });
  }

  async function closeCard() {
    if (!activeQuestion || !sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "CLOSE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    setActiveQuestion(null);
  }

  async function viewAssistance() {
    if (!activeQuestion || !sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "VIEW_ASSISTANCE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    const response = await fetch("/api/advisor/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, intent: activeQuestion.intent, question: activeQuestion.fragment }),
    });
    setAnswer(await response.json());
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
    setActiveQuestion(null);
    setAnswer(null);
  }

  async function escalate() {
    if (!sessionId || !activeQuestion) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType: "BUTTON_SELECTED",
        intent: activeQuestion.intent,
        confidence: activeQuestion.confidence,
        button: "ESCALATE",
        payload: { questionId: activeQuestion.id, trigger: activeQuestion.fragment },
      }),
    });
    setNotice("CASO ESCALADO.");
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
    setNotice("BRECHA REGISTRADA.");
    setActiveQuestion(null);
    setAnswer(null);
  }

  return (
    <AuthShell>
      <div className="space-y-6"> {/* Reduced from 8 to 6 for vertical space */}
        {/* HERO BANNER: Advisor & Client (Reduced size) */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight to-onyx border border-line p-6 shadow-2xl"> {/* Reduced from p-8 to p-6 */}
            <div className="absolute top-0 right-0 p-4 text-brand/10"> {/* Reduced p */}
              <Zap size={100} fill="currentColor" />
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand shadow-inner"> {/* h-20->h-16 */}
                <User size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-0.5">Atención</p>
                <h2 className="text-2xl font-black tracking-tighter text-ink leading-tight">{advisor.name}</h2>
                <p className="text-muted font-bold text-[10px] uppercase">{office.name} • {advisor.seniority}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Badge tone={workday === "active" ? "success" : workday === "paused" ? "warn" : "neutral"}>
                    {workday === "active" ? "ACTIVO" : workday === "paused" ? "PAUSADO" : "OFFLINE"}
                  </Badge>
                  <div className="flex gap-2">
                    <button onClick={() => setWorkday("active")} className="p-1.5 rounded-lg bg-surface border border-line hover:border-brand text-muted hover:text-brand transition-all">
                      <Play size={14} />
                    </button>
                    <button onClick={() => setWorkday(workday === "paused" ? "active" : "paused")} className="p-1.5 rounded-lg bg-surface border border-line hover:border-warn text-muted hover:text-warn transition-all">
                      <Pause size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-midnight border border-line p-6 shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-cyan mb-0.5">Identificación</p>
                  <h2 className="text-2xl font-black tracking-tighter text-ink leading-tight">Cliente</h2>
                </div>
                {selectedCustomer && <Badge tone="brand">VERIFICADO</Badge>}
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    value={documentId}
                    onChange={(event) => setDocumentId(event.target.value)}
                    className="w-full rounded-xl border border-line bg-onyx py-3 pl-10 pr-4 text-xs font-bold focus:border-neon-cyan focus:ring-0 transition-all placeholder:text-muted/50 uppercase"
                    placeholder="DOCUMENTO"
                  />
                </div>
                <div className="flex gap-2">
                  <ActionButton onClick={searchCustomer} variant="secondary" size="md">
                    BUSCAR
                  </ActionButton>
                  <ActionButton onClick={startAttention} disabled={workday !== "active" || attention !== "customer_loaded"} size="md">
                    INICIAR ATENCIÓN
                  </ActionButton>
                  <ActionButton onClick={finishAttention} disabled={attention !== "in_attention"} variant="danger" size="md">
                    FINALIZAR
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN AREA: Copilot & Insights (Full Width) */}
        <div className="space-y-6">
          
          {/* Visual Insights Cards (Expanded) */}
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 animate-in fade-in duration-500">
            {selectedCustomer && attention === "in_attention" ? (
              <>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-brand transition-all group">
                  <p className="text-[8px] font-black text-brand uppercase tracking-wider mb-1">Nombre</p>
                  <p className="font-black text-ink text-xs truncate uppercase">{selectedCustomer.name}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-brand transition-all group">
                  <p className="text-[8px] font-black text-brand uppercase tracking-wider mb-1">Segmento</p>
                  <p className="font-black text-ink text-xs truncate uppercase">{selectedCustomer.segment}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-neon-cyan transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <TrendingUp className="text-neon-cyan group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-neon-cyan">{selectedCustomer.simulatedScore}</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Score</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.commercialPropensity}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-warn transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <AlertTriangle className="text-warn group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-warn uppercase">Riesgo</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Alertas</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.riskAlerts[0]}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-electric-violet transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <Target className="text-electric-violet group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-electric-violet uppercase">Venta</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Sugerencia</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.softInsights[0]}</p>
                </div>
                {/* 3 Additional Insights (Requested) */}
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-brand transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <Shield className="text-brand group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-brand uppercase">Perfil</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Fidelización</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.softInsights[5]}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-accent transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <BarChart className="text-accent group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-accent uppercase">Actividad</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Comportamiento</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.softInsights[4]}</p>
                </div>
                <div className="rounded-2xl bg-midnight border border-line p-4 hover:border-warn transition-all group">
                  <div className="flex items-center justify-between mb-2">
                     <Lightbulb className="text-warn group-hover:scale-110 transition-transform" size={20} />
                     <span className="text-[10px] font-black text-warn uppercase">Tip BOCA</span>
                  </div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-wider">Cross-Sell</p>
                  <p className="mt-0.5 font-black text-ink text-xs truncate">{selectedCustomer.softInsights[3]}</p>
                </div>
              </>
            ) : (
              <div className="col-span-4 lg:col-span-8 rounded-2xl bg-midnight border border-dashed border-line p-6 flex items-center justify-center gap-4">
                 <ShieldCheck className="text-brand/50" size={32} />
                 <p className="text-sm font-bold text-muted/60 uppercase tracking-widest italic">
                   BOCA: Escaneando la conversación en tiempo real para detectar oportunidades y brindar asistencia estructurada.
                 </p>
              </div>
            )}
          </div>

          {/* COPILOT CORE */}
          <div className="space-y-6">
             {activeQuestion ? (
                <div className="animate-in zoom-in-95 duration-300">
                  <Panel 
                    title="Asistencia Detectada" 
                    variant="neon"
                    action={
                      <div className="flex items-center gap-4">
                        <Badge tone="brand">CONFIANZA: {Math.round(activeQuestion.confidence * 100)}%</Badge>
                        <div className="flex items-center gap-2 border-l border-line pl-4">
                           <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                           <span className="text-[10px] font-black text-muted uppercase">MIC ACTIVO</span>
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-brand/5 border border-brand/20">
                         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/40">
                            <Sparkles size={24} />
                         </div>
                         <div className="flex-1">
                            <p className="text-xs font-black text-brand uppercase tracking-widest mb-1">Intención: {activeQuestion.topic}</p>
                            <p className="text-lg font-black text-ink leading-tight italic">"{activeQuestion.fragment}"</p>
                         </div>
                      </div>

                      {!answer ? (
                        <div className="flex gap-3">
                          <ActionButton onClick={viewAssistance} size="lg">GENERAR ASISTENCIA BOCA</ActionButton>
                          <ActionButton onClick={closeCard} variant="secondary" size="lg">DESCARTAR</ActionButton>
                        </div>
                      ) : (
                        <div className="space-y-6 border-t border-line pt-6 animate-in fade-in slide-in-from-bottom-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Guion Sugerido</p>
                                <div className="rounded-2xl bg-onyx border border-line p-5 text-sm leading-relaxed font-medium italic">
                                  "{answer.script}"
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Checklist Operativo</p>
                                <ul className="space-y-2">
                                  {answer.checklist.map((c, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-ink">
                                      <CheckCircle2 size={16} className="text-accent" /> {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <div className="rounded-2xl bg-surface border border-line p-5">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 text-center">Próxima Mejor Acción</p>
                                <p className="text-center font-black text-neon-cyan uppercase tracking-tight">{answer.nextBestAction}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black text-muted uppercase tracking-widest">Fuentes Consultadas</p>
                                 <div className="flex flex-wrap gap-2">
                                    {answer.sources.map(s => <Badge key={s.id} tone="brand">{s.label}</Badge>)}
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                <ActionButton onClick={markResolved} size="sm" className="flex-1">RESUELTO</ActionButton>
                                <ActionButton onClick={escalate} variant="secondary" size="sm"><Flag size={14} /></ActionButton>
                                <ActionButton onClick={reportGap} variant="secondary" size="sm">BRECHA</ActionButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-midnight/50 py-24 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 blur-2xl bg-brand/20 rounded-full animate-pulse"></div>
                    <ShieldCheck className="relative text-brand" size={48} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-ink uppercase">BOCA Contextual Scaning</h3>
                  <p className="mt-1 max-w-sm text-muted font-bold text-xs uppercase tracking-widest">{notice}</p>
                  
                  {/* Status witness when no active question */}
                  <div className="mt-8 flex items-center gap-4 border-t border-line/20 pt-8">
                     <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${voiceStatus === 'connected' ? 'bg-accent animate-pulse' : 'bg-muted'}`}></div>
                        <span className="text-[10px] font-black text-muted uppercase">{voiceStatus === 'connected' ? 'Escuchando' : 'Micrófono Inactivo'}</span>
                     </div>
                     <Badge tone={voiceStatus === "connected" ? "success" : voiceStatus === "error" ? "danger" : "neutral"}>
                        WS: {voiceStatus.toUpperCase()}
                     </Badge>
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* TRANSCRIPTION DRAWER (Option A) */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-80 bg-midnight border-l border-line shadow-2xl transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-line bg-onyx/50">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ink">Monitor de Voz</h3>
            <button onClick={() => setIsDrawerOpen(false)} className="text-muted hover:text-ink transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {liveLines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <MessageSquare size={32} className="mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Esperando señal...</p>
              </div>
            ) : (
              liveLines.map((line, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-right-2">
                  <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em] mb-1">{line.speaker}</p>
                  <div className="bg-onyx border border-line p-3 rounded-xl rounded-tl-none">
                    <p className="text-xs font-medium leading-relaxed">{line.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-6 border-t border-line bg-onyx/30">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-muted uppercase italic">Último estado: {notice}</span>
                <Radio size={14} className={voiceStatus === 'connected' ? 'text-accent animate-pulse' : 'text-muted'} />
             </div>
             <p className="text-[8px] text-muted font-medium text-center uppercase tracking-widest">Detección Whisper local habilitada</p>
          </div>
        </div>
      </div>

      {/* DRAWER TRIGGER BUTTON */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className={`fixed bottom-8 right-8 z-[55] flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/20 transition-all hover:scale-110 active:scale-95 ${isDrawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={20} />
        {liveLines.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-white ring-2 ring-midnight animate-bounce">
            {liveLines.length}
          </span>
        )}
      </button>

      {/* PRIVACY FOOTER (Moved/Integrated as requested to be less useful/obvious) */}
      <footer className="mt-8 border-t border-line/20 pt-6 flex justify-between items-center text-[10px] font-bold text-muted/40 uppercase tracking-widest">
         <div className="flex items-center gap-2">
            <Shield size={12} />
            <span>Encriptación BOCA activa</span>
         </div>
         <p>© 2026 BOCA Contextual Systems</p>
      </footer>
    </AuthShell>
  );
}
