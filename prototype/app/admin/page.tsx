"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw, Filter } from "lucide-react";
import { ActionButton, Badge, Panel } from "@/components/ui";
import { AuthShell } from "@/components/auth-shell";

type Gap = {
  id: string;
  status: string;
  topic: string;
  intent: string;
  office_id: string;
  question_text: string;
  source_ids: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [topicFilter, setTopicFilter] = useState("todos");
  const [officeFilter, setOfficeFilter] = useState("todos");

  async function load() {
    const response = await fetch("/api/gaps");
    const data = await response.json();
    setGaps(data.gaps);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: string) {
    await fetch(`/api/gaps/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  const filtered = gaps.filter((gap) => {
    const matchesStatus = statusFilter === "todos" || gap.status === statusFilter;
    const matchesTopic = topicFilter === "todos" || gap.topic === topicFilter;
    const matchesOffice = officeFilter === "todos" || gap.office_id === officeFilter;
    return matchesStatus && matchesTopic && matchesOffice;
  });

  const topics = Array.from(new Set(gaps.map((gap) => gap.topic)));

  const selectClasses = "mt-1 w-full rounded-xl border border-line bg-onyx px-4 py-2 text-sm font-bold text-ink focus:border-brand focus:ring-0 transition-all";

  return (
    <AuthShell>
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Administrador</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-ink uppercase">Gestión de Brechas</h1>
          <p className="mt-2 max-w-3xl text-muted font-bold">
            Revisa los vacíos de conocimiento reportados y gestiona el ciclo de vida de la respuesta.
          </p>
        </div>
        <ActionButton onClick={load} variant="secondary">
          <span className="flex items-center gap-2">
            <RefreshCw size={15} /> ACTUALIZAR
          </span>
        </ActionButton>
      </div>

      <Panel title="Centro de Control de Brechas" variant="neon">
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="flex items-center gap-2 mb-2"><Filter size={12} /> Estado</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={selectClasses}>
              <option value="todos">TODOS</option>
              <option value="pendiente">PENDIENTE</option>
              <option value="en_revision">EN REVISIÓN</option>
              <option value="resuelta">RESUELTA</option>
            </select>
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="flex items-center gap-2 mb-2"><ClipboardList size={12} /> Tema</span>
            <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} className={selectClasses}>
              <option value="todos">TODOS</option>
              {topics.map((topic) => <option key={topic} value={topic}>{topic.toUpperCase()}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="flex items-center gap-2 mb-2"><Filter size={12} /> Sede</span>
            <select value={officeFilter} onChange={(event) => setOfficeFilter(event.target.value)} className={selectClasses}>
              <option value="todos">TODAS</option>
              <option value="off_001">BARRANQUILLA CENTRO</option>
              <option value="off_002">BOGOTÁ NORTE</option>
              <option value="off_003">CARTAGENA BOCAGRANDE</option>
              <option value="off_004">MEDELLÍN EL POBLADO</option>
              <option value="off_005">CALI CHIPICHAPE</option>
            </select>
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-muted">
            <span className="flex items-center gap-2 mb-2"><Filter size={12} /> Prioridad</span>
            <select className={selectClasses} defaultValue="frecuencia">
              <option value="frecuencia">POR FRECUENCIA</option>
              <option value="reciente">MÁS RECIENTES</option>
            </select>
          </label>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-onyx/50 text-center text-muted">
              <ClipboardList className="mb-4 opacity-20" size={48} />
              <p className="text-sm font-black uppercase tracking-widest">Sin brechas registradas</p>
            </div>
          ) : (
            filtered.map((gap) => (
              <div key={gap.id} className="rounded-2xl border border-line bg-midnight p-6 hover:border-brand/50 transition-all group">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-black tracking-tight text-ink uppercase">{gap.topic}</p>
                      <Badge tone={gap.status === "resuelta" ? "success" : "warn"}>{gap.status.toUpperCase()}</Badge>
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted leading-relaxed italic">"{gap.question_text}"</p>
                    
                    <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider">
                       <div className="flex flex-col">
                          <span className="text-brand/50 mb-0.5">Intención</span>
                          <span className="text-ink">{gap.intent}</span>
                       </div>
                       <div className="flex flex-col border-l border-line pl-4">
                          <span className="text-brand/50 mb-0.5">Fuente Asociada</span>
                          <span className="text-ink">{gap.source_ids || "SIN FUENTE"}</span>
                       </div>
                    </div>
                    
                    <div className="mt-6 rounded-xl bg-onyx border border-line p-4 text-xs font-bold text-muted group-hover:border-brand/30 transition-all">
                      <span className="text-brand mr-2">BOCA SUGIERE:</span> Validar fuente técnica y programar refuerzo en la sede antes de cerrar.
                    </div>
                  </div>
                  
                  <div className="min-w-[200px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand/70 mb-2 block">
                      Cambiar Estado
                    </label>
                    <select
                      value={gap.status}
                      onChange={(event) => update(gap.id, event.target.value)}
                      className="w-full rounded-xl border border-brand/30 bg-midnight px-4 py-3 text-sm font-black text-ink focus:border-brand transition-all cursor-pointer"
                    >
                      <option value="pendiente">PENDIENTE</option>
                      <option value="en_revision">EN REVISIÓN</option>
                      <option value="resuelta">RESUELTA</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
    </AuthShell>
  );
}
