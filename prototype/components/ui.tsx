import type { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "danger" | "brand" }) {
  const tones = {
    neutral: "bg-surface text-muted",
    success: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    brand: "bg-blue-50 text-brand",
  };
  return <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded border border-line bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <h2 className="font-semibold text-ink">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded border border-line bg-white p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-brand text-white hover:bg-blue-700",
    secondary: "border border-line bg-white text-ink hover:bg-surface",
    danger: "bg-danger text-white hover:bg-red-800",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`focus-ring rounded px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
