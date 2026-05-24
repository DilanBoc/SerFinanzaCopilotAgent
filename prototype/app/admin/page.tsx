"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
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

  return (
    <AuthShell>
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand">Administrador</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Cola de brechas de conocimiento</h1>
          <p className="mt-2 max-w-3xl text-muted">
            Revisa vacios reportados por asesores y cambia su estado operativo.
          </p>
        </div>
        <ActionButton onClick={load} variant="secondary">
          <span className="flex items-center gap-2">
            <RefreshCw size={15} /> Actualizar
          </span>
        </ActionButton>
      </div>

      <Panel title="Brechas pendientes">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <label className="text-sm font-medium text-ink">
            Estado
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 w-full rounded border border-line px-3 py-2 text-sm">
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En revision</option>
              <option value="resuelta">Resuelta</option>
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Tema
            <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} className="mt-1 w-full rounded border border-line px-3 py-2 text-sm">
              <option value="todos">Todos</option>
              {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Sede
            <select value={officeFilter} onChange={(event) => setOfficeFilter(event.target.value)} className="mt-1 w-full rounded border border-line px-3 py-2 text-sm">
              <option value="todos">Todas</option>
              <option value="off_001">Barranquilla Centro</option>
              <option value="off_002">Bogota Norte</option>
              <option value="off_003">Cartagena Bocagrande</option>
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Prioridad
            <select className="mt-1 w-full rounded border border-line px-3 py-2 text-sm" defaultValue="frecuencia">
              <option value="frecuencia">Por frecuencia</option>
              <option value="reciente">Mas recientes</option>
            </select>
          </label>
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded border border-dashed border-line text-center text-muted">
              <div>
                <ClipboardList className="mx-auto mb-3" size={26} />
                No hay brechas registradas. Reporta una desde el puesto del asesor.
              </div>
            </div>
          ) : (
            filtered.map((gap) => (
              <div key={gap.id} className="rounded border border-line p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{gap.topic}</p>
                      <Badge tone={gap.status === "resuelta" ? "success" : "warn"}>{gap.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted">{gap.question_text}</p>
                    <p className="mt-2 text-xs text-muted">Intencion: {gap.intent}</p>
                    <p className="mt-1 text-xs text-muted">Fuentes: {gap.source_ids ?? "sin fuente suficiente"}</p>
                    <p className="mt-3 rounded bg-surface p-3 text-sm text-muted">
                      Accion sugerida: validar fuente y reforzar entrenamiento antes de cerrar la brecha.
                    </p>
                  </div>
                  <div className="min-w-44">
                    <label className="text-xs font-medium text-muted">
                      Cambiar estado
                      <select
                        value={gap.status}
                        onChange={(event) => update(gap.id, event.target.value)}
                        className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm text-ink"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_revision">En revision</option>
                        <option value="resuelta">Resuelta</option>
                      </select>
                    </label>
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
