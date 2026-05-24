"use client";

import { useEffect, useState } from "react";
import { Send, TrendingUp, Target, AlertTriangle } from "lucide-react";
import { ActionButton, Badge, Panel } from "@/components/ui";
import { AuthShell } from "@/components/auth-shell";

type Opportunity = {
  id: string;
  topic: string;
  frequency: number;
  impact_score: number;
  web_content_status: string;
  recommendation: string;
  sources: string;
};

export default function MarketingPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedPath, setSavedPath] = useState("");

  useEffect(() => {
    fetch("/api/marketing/opportunities")
      .then((response) => response.json())
      .then((data) => setOpportunities(data.opportunities));
  }, []);

  async function generateReport() {
    const response = await fetch("/api/marketing/report", { method: "POST" });
    const data = await response.json();
    setSavedPath(data.filePath);
  }

  return (
    <AuthShell>
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Marketing & Contenido</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-ink uppercase">Oportunidades Estratégicas</h1>
          <p className="mt-2 max-w-3xl text-muted font-bold">
            Análisis de brechas agregadas y consultas frecuentes para la optimización de contenido omnicanal.
          </p>
        </div>
        <ActionButton onClick={generateReport} variant="neon" size="lg">
          <span className="flex items-center gap-2">
            <Send size={18} /> GENERAR REPORTE BOCA
          </span>
        </ActionButton>
      </div>

      {savedPath ? (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <Badge tone="success">SISTEMA: REPORTE GENERADO EXITOSAMENTE EN {savedPath}</Badge>
        </div>
      ) : null}

      <div className="grid gap-6">
        <Panel title="Radar de Oportunidades Priorizadas" variant="neon">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item) => (
              <div key={item.id} className="rounded-3xl border border-line bg-midnight p-6 hover:border-brand/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-onyx border border-line group-hover:bg-brand/10 transition-colors">
                      {item.impact_score > 80 ? <Target className="text-brand" size={24} /> : <TrendingUp className="text-accent" size={24} />}
                    </div>
                    <Badge tone={item.web_content_status.includes("incompleto") ? "warn" : "brand"}>
                      {item.web_content_status.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-ink uppercase mb-2">{item.topic}</h3>
                  <p className="text-sm font-medium text-muted leading-relaxed mb-6 italic">"{item.recommendation}"</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-line/50">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand/70">
                    <span>Frecuencia Mensual</span>
                    <span className="text-ink text-sm">{item.frequency}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand/70">
                    <span>Índice de Impacto</span>
                    <span className="text-ink text-sm">{item.impact_score}%</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                     <span className="text-[9px] font-bold text-ink bg-onyx px-2 py-1 rounded-lg border border-line uppercase">Persona Natural</span>
                     <span className="text-[9px] font-bold text-ink bg-onyx px-2 py-1 rounded-lg border border-line uppercase">Oficina</span>
                     <span className="text-[9px] font-bold text-ink bg-onyx px-2 py-1 rounded-lg border border-line uppercase">Sede Central</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Simulation of a new detected opportunity without backend record */}
            <div className="rounded-3xl border border-dashed border-line bg-onyx/30 p-6 flex flex-col items-center justify-center text-center group hover:border-brand/50 transition-all">
               <div className="h-16 w-16 rounded-full bg-midnight border border-line flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="text-muted/30 group-hover:text-brand" size={32} />
               </div>
               <p className="text-xs font-black uppercase tracking-widest text-muted/50 group-hover:text-ink transition-colors">
                 Escaneando nuevas fricciones...
               </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
    </AuthShell>
  );
}
