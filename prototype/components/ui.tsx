import type { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "danger" | "brand" }) {
  const tones = {
    neutral: "bg-surface text-muted border border-line",
    success: "bg-emerald-950/30 text-emerald-400 border border-emerald-800/50",
    warn: "bg-amber-950/30 text-amber-400 border border-amber-800/50",
    danger: "bg-red-950/30 text-red-400 border border-red-800/50",
    brand: "bg-blue-950/30 text-blue-400 border border-blue-800/50",
  };
  return <span className={`inline-flex rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
}

export function Panel({ title, children, action, variant = "default" }: { title: string; children: ReactNode; action?: ReactNode; variant?: "default" | "neon" }) {
  return (
    <section className={`rounded-xl border border-line bg-midnight overflow-hidden ${variant === "neon" ? "shadow-[0_0_15px_rgba(0,112,255,0.1)] border-brand/30" : ""}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 bg-onyx/50">
        <h2 className="text-sm font-bold tracking-tight text-ink/90 uppercase">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-xl border border-line bg-midnight p-5 shadow-sm hover:border-brand/50 transition-colors">
      <p className="text-xs font-medium text-muted uppercase tracking-widest">{label}</p>
      <p className="mt-2 text-4xl font-black text-ink tracking-tight">{value}</p>
      {detail ? <p className="mt-2 text-xs text-muted/80">{detail}</p> : null}
    </div>
  );
}

export function ActionButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  disabled,
  title,
  type = "button",
  size = "md"
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "neon";
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary: "bg-brand text-white hover:bg-blue-600 shadow-lg shadow-brand/20",
    secondary: "border border-line bg-onyx text-ink hover:bg-surface",
    danger: "bg-danger text-white hover:bg-red-700 shadow-lg shadow-danger/20",
    neon: "bg-onyx border border-brand text-brand hover:bg-brand hover:text-white shadow-[0_0_10px_rgba(0,112,255,0.3)] transition-all"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`focus-ring rounded-lg font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
