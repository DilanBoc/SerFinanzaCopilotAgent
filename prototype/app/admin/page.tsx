"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
import { ActionButton, Badge, Panel } from "@/components/ui";

type Gap = {
  id: string;
  status: string;
  topic: string;
  intent: string;
  question_text: string;
  source_ids: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [gaps, setGaps] = useState<Gap[]>([]);

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

  return (
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
        <div className="space-y-3">
          {gaps.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded border border-dashed border-line text-center text-muted">
              <div>
                <ClipboardList className="mx-auto mb-3" size={26} />
                No hay brechas registradas. Reporta una desde el puesto del asesor.
              </div>
            </div>
          ) : (
            gaps.map((gap) => (
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
                  <div className="flex min-w-40 flex-col gap-2">
                    <ActionButton onClick={() => update(gap.id, "pendiente")} variant="secondary">
                      Pendiente
                    </ActionButton>
                    <ActionButton onClick={() => update(gap.id, "en_revision")} variant="secondary">
                      En revision
                    </ActionButton>
                    <ActionButton onClick={() => update(gap.id, "resuelta")}>Resuelta</ActionButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
