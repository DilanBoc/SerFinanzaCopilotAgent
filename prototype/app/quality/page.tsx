"use client";

import { useEffect, useState } from "react";
import { BarChart3, Filter, GraduationCap, MapPin, Users, Globe } from "lucide-react";
import { Badge, Metric, Panel } from "@/components/ui";
import { AuthShell } from "@/components/auth-shell";

type Dashboard = {
  kpis: { detected: number; knows: number; support: number; escalations: number; gaps: number };
  trend: { cdtWeeklyGrowth: number; topRisingTopic: string; mainTrainingNeed: string };
  byTopic: { topic: string; support: number; knows: number; gaps: number }[];
  byOffice: { office: string; support: number; gaps: number }[];
  advisorFocus: { advisor: string; office: string; recommendation: string };
};

export default function QualityPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [cityFilter, setCityFilter] = useState("todas");
  const [officeFilter, setOfficeFilter] = useState("todas");

  useEffect(() => {
    fetch("/api/dashboard/quality")
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return (
    <AuthShell>
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted font-bold animate-pulse uppercase tracking-[0.2em]">Cargando Inteligencia Operacional...</p>
      </div>
    </AuthShell>
  );

  const selectClasses = "mt-1 w-full rounded-xl border border-line bg-onyx px-4 py-2 text-xs font-bold text-ink focus:border-brand transition-all";

  return (
    <AuthShell>
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Calidad & Entrenamiento</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-ink uppercase">Análisis de Fricción</h1>
          <p className="mt-2 max-w-3xl text-muted font-bold">
            Monitorea el desempeño asistido y el dominio de temas en la red de oficinas en tiempo real.
          </p>
        </div>
        <div className="flex gap-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-muted">
              <span className="flex items-center gap-2 mb-1"><MapPin size={12} /> Ciudad</span>
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={selectClasses}>
                <option value="todas">TODAS</option>
                <option value="barranquilla">BARRANQUILLA</option>
                <option value="bogota">BOGOTÁ</option>
                <option value="medellin">MEDELLÍN</option>
                <option value="cali">CALI</option>
              </select>
           </label>
           <label className="text-[10px] font-black uppercase tracking-widest text-muted">
              <span className="flex items-center gap-2 mb-1"><Globe size={12} /> Sede</span>
              <select value={officeFilter} onChange={(e) => setOfficeFilter(e.target.value)} className={selectClasses}>
                <option value="todas">TODAS LAS SEDES</option>
                <option value="off_001">CENTRO</option>
                <option value="off_002">NORTE</option>
                <option value="off_003">BOCAGRANDE</option>
                <option value="off_004">EL POBLADO</option>
                <option value="off_005">CHIPICHAPE</option>
              </select>
           </label>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Consultas BOCA" value={data.kpis.detected} />
        <Metric label="Dominio Propio" value={data.kpis.knows} detail="Sin requerir asistencia" />
        <Metric label="Asistencia BOCA" value={data.kpis.support} detail="Guion/Checklist usado" />
        <Metric label="Escalamientos" value={data.kpis.escalations} />
        <Metric label="Brechas" value={data.kpis.gaps} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Tendencias de 30 Días" variant="neon">
           <div className="space-y-6">
              <div className="rounded-2xl bg-onyx border border-line p-5 group hover:border-brand/50 transition-all">
                <p className="text-[10px] font-black text-brand uppercase tracking-widest">Tema Emergente</p>
                <p className="mt-2 text-lg font-black text-ink uppercase">{data.trend.topRisingTopic}</p>
                <div className="mt-3 flex items-center gap-2 text-accent font-black">
                  <BarChart3 size={16} />
                  <span>+{data.trend.cdtWeeklyGrowth}% ESTA SEMANA</span>
                </div>
              </div>
              <div className="rounded-2xl bg-onyx border border-line p-5 group hover:border-warn/50 transition-all">
                <p className="text-[10px] font-black text-warn uppercase tracking-widest">Entrenamiento Crítico</p>
                <p className="mt-2 text-lg font-black text-ink uppercase leading-tight">{data.trend.mainTrainingNeed}</p>
                <p className="mt-3 text-[10px] font-bold text-muted uppercase">Requiere intervención en Sede Norte y Cali</p>
              </div>
           </div>
        </Panel>

        <Panel title="Fricción por Tema" variant="default">
          <div className="space-y-4">
            {data.byTopic.map((item) => (
              <div key={item.topic} className="rounded-2xl border border-line bg-midnight p-4 hover:bg-onyx/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-ink text-sm uppercase tracking-tight">{item.topic}</p>
                  <Badge tone={item.gaps > 0 ? "warn" : "success"}>{item.gaps} BRECHAS</Badge>
                </div>
                <div className="flex gap-4">
                   <div className="flex-1 bg-onyx rounded-lg p-2 border border-line/30">
                      <p className="text-[8px] font-black text-muted uppercase">Asistencia</p>
                      <p className="text-lg font-black text-brand leading-none mt-1">{item.support}</p>
                   </div>
                   <div className="flex-1 bg-onyx rounded-lg p-2 border border-line/30">
                      <p className="text-[8px] font-black text-muted uppercase">Dominio</p>
                      <p className="text-lg font-black text-accent leading-none mt-1">{item.knows}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Desempeño por Sede" variant="default">
          <div className="space-y-4">
            {data.byOffice.map((item) => (
              <div key={item.office} className="rounded-2xl border border-line bg-midnight p-4 hover:bg-onyx/50 transition-all">
                <div className="flex items-center justify-between">
                  <p className="font-black text-ink text-sm uppercase tracking-tight">{item.office}</p>
                  <div className="text-right">
                    <p className="text-lg font-black text-brand leading-none">{item.support}</p>
                    <p className="text-[8px] font-black text-muted uppercase mt-1">Apoyos</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-onyx rounded-full overflow-hidden border border-line/20">
                   <div 
                      className="h-full bg-brand shadow-[0_0_8px_rgba(0,112,255,0.5)]" 
                      style={{ width: `${Math.min(100, (item.support / 40) * 100)}%` }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Foco de Coaching Individual" variant="neon">
        <div className="flex items-center gap-8 py-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-electric-violet text-white shadow-2xl">
            <Users size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
               <h3 className="text-2xl font-black tracking-tighter text-ink uppercase">{data.advisorFocus.advisor}</h3>
               <Badge tone="brand">{data.advisorFocus.office.toUpperCase()}</Badge>
            </div>
            <p className="mt-2 text-muted font-bold italic leading-relaxed">
               "BOCA sugiere: {data.advisorFocus.recommendation}"
            </p>
          </div>
          <div className="flex gap-2">
             <ActionButton variant="secondary">VER HISTORIAL</ActionButton>
             <ActionButton variant="primary">PLAN DE ACCIÓN</ActionButton>
          </div>
        </div>
      </Panel>
    </div>
    </AuthShell>
  );
}
