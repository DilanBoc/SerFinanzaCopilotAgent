import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, FileText, Headphones } from "lucide-react";

const cards = [
  {
    href: "/advisor",
    title: "Puesto del asesor",
    description: "Ejecuta la demo principal con transcripcion simulada y asistencia contextual.",
    icon: Headphones,
  },
  {
    href: "/quality",
    title: "Panel calidad",
    description: "Revisa fricciones por sede, asesor, tema, producto y tipo de evento.",
    icon: BarChart3,
  },
  {
    href: "/admin",
    title: "Consola administrador",
    description: "Gestiona brechas de conocimiento reportadas durante la atencion.",
    icon: ClipboardList,
  },
  {
    href: "/marketing",
    title: "Reporte marketing",
    description: "Genera oportunidades de contenido y preview Markdown diario.",
    icon: FileText,
  },
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">MVP local</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink">
          Copiloto contextual para asesores de oficina
        </h1>
        <p className="mt-4 text-lg leading-7 text-muted">
          Convierte conversaciones presenciales en respuestas trazables, brechas de conocimiento y oportunidades
          accionables para calidad y marketing.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="group rounded border border-line bg-white p-5 hover:border-brand">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-surface text-brand">
                    <Icon size={19} />
                  </span>
                  <div>
                    <h2 className="font-semibold text-ink">{card.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{card.description}</p>
                  </div>
                </div>
                <ArrowRight className="mt-1 text-muted group-hover:text-brand" size={18} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
