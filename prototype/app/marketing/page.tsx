"use client";

import { useEffect, useState } from "react";
import { FileText, Send } from "lucide-react";
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
  const [markdown, setMarkdown] = useState("");
  const [savedPath, setSavedPath] = useState("");

  useEffect(() => {
    fetch("/api/marketing/opportunities")
      .then((response) => response.json())
      .then((data) => setOpportunities(data.opportunities));
    fetch("/api/marketing/report")
      .then((response) => response.json())
      .then((data) => setMarkdown(data.content));
  }, []);

  async function generateReport() {
    const response = await fetch("/api/marketing/report", { method: "POST" });
    const data = await response.json();
    setMarkdown(data.content);
    setSavedPath(data.filePath);
  }

  return (
    <AuthShell>
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand">Marketing / contenido</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Oportunidades desde friccion real</h1>
          <p className="mt-2 max-w-3xl text-muted">
            Convierte consultas repetidas y brechas agregadas en briefs revisables por humanos.
          </p>
        </div>
        <ActionButton onClick={generateReport}>
          <span className="flex items-center gap-2">
            <Send size={15} /> Generar Markdown
          </span>
        </ActionButton>
      </div>

      {savedPath ? <Badge tone="success">Reporte guardado: {savedPath}</Badge> : null}

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Oportunidades priorizadas">
          <div className="space-y-3">
            {opportunities.map((item) => (
              <div key={item.id} className="rounded border border-line p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.topic}</p>
                    <p className="mt-2 text-sm text-muted">{item.recommendation}</p>
                  </div>
                  <Badge tone="warn">{item.web_content_status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted">
                  <span>Frecuencia: {item.frequency}</span>
                  <span>Impacto: {item.impact_score}</span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted md:grid-cols-3">
                  <span className="rounded bg-surface px-2 py-1">Segmento: persona natural</span>
                  <span className="rounded bg-surface px-2 py-1">Canal: oficina</span>
                  <span className="rounded bg-surface px-2 py-1">Sede: Barranquilla Centro</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Preview reporte diario"
          action={
            <Badge tone="brand">
              <FileText size={13} /> Markdown
            </Badge>
          }
        >
          <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded bg-ink p-4 text-sm leading-6 text-white">
            {markdown}
          </pre>
        </Panel>
      </section>
    </div>
    </AuthShell>
  );
}
