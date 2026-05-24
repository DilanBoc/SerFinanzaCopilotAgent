"use client";

import { useEffect, useState } from "react";
import { BarChart3, Filter, GraduationCap } from "lucide-react";
import { Badge, Metric, Panel } from "@/components/ui";

type Dashboard = {
  kpis: { detected: number; knows: number; support: number; escalations: number; gaps: number };
  byTopic: { topic: string; support: number; knows: number; gaps: number }[];
  byOffice: { office: string; support: number; gaps: number }[];
  advisorFocus: { advisor: string; office: string; recommendation: string };
};

export default function QualityPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/quality")
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-muted">Cargando dashboard...</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand">Supervisor / calidad</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Friccion operacional por atencion</h1>
          <p className="mt-2 max-w-3xl text-muted">
            Mide donde los asesores dominan temas, donde piden apoyo y que debe reforzarse por sede o asesor.
          </p>
        </div>
        <Badge tone="brand">
          <Filter size={13} /> Filtros demo activos
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Preguntas detectadas" value={data.kpis.detected} />
        <Metric label="Lo se" value={data.kpis.knows} detail="Resuelto sin apoyo" />
        <Metric label="Ver respuesta" value={data.kpis.support} detail="Apoyo requerido" />
        <Metric label="Escalamientos" value={data.kpis.escalations} />
        <Metric label="Brechas" value={data.kpis.gaps} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Temas con mayor apoyo requerido">
          <div className="space-y-3">
            {data.byTopic.map((item) => (
              <div key={item.topic} className="rounded border border-line p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.topic}</p>
                  <Badge tone={item.gaps > 0 ? "warn" : "neutral"}>{item.gaps} brechas</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
                  <span>Apoyo requerido: {item.support}</span>
                  <span>Dominio confirmado: {item.knows}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Sedes con friccion">
          <div className="space-y-3">
            {data.byOffice.map((item) => (
              <div key={item.office} className="rounded border border-line p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.office}</p>
                  <Badge tone="brand">
                    <BarChart3 size={13} /> {item.support} apoyos
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted">Brechas reportadas: {item.gaps}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="Vista individual bajo filtro">
        <div className="flex items-start gap-3 rounded bg-surface p-4">
          <GraduationCap className="text-brand" size={22} />
          <div>
            <p className="font-medium">
              {data.advisorFocus.advisor} - {data.advisorFocus.office}
            </p>
            <p className="mt-1 text-muted">{data.advisorFocus.recommendation}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
