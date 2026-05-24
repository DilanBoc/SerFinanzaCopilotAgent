import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, FileText, Headphones, ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serfinanza Action Hub",
  description: "Copiloto contextual para asesores de oficina",
};

const navItems = [
  { href: "/advisor", label: "Puesto asesor", icon: Headphones },
  { href: "/quality", label: "Calidad", icon: BarChart3 },
  { href: "/admin", label: "Brechas", icon: ClipboardList },
  { href: "/marketing", label: "Marketing", icon: FileText },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-line bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3 font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded bg-brand text-white">
                  <ShieldCheck size={19} />
                </span>
                <span>Serfinanza Action Hub</span>
              </Link>
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink"
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
