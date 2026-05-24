"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, ClipboardList, FileText, Headphones, LogOut, ShieldCheck } from "lucide-react";
import { allowedRoutes, routeForRole, type DemoUser } from "@/lib/auth";
import { clearStoredUser, useDemoAuth } from "@/lib/use-demo-auth";

const navItems = [
  { href: "/advisor", label: "Puesto asesor", icon: Headphones },
  { href: "/quality", label: "Calidad", icon: BarChart3 },
  { href: "/admin", label: "Brechas", icon: ClipboardList },
  { href: "/marketing", label: "Marketing", icon: FileText },
];

function visibleNav(user: DemoUser) {
  const routes = allowedRoutes(user.role);
  return navItems.filter((item) => routes.includes(item.href));
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useDemoAuth({ requireAuth: true });
  const router = useRouter();

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-muted">
        Validando sesion...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={routeForRole(user.role)} className="flex items-center gap-3 font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-brand text-white">
              <ShieldCheck size={19} />
            </span>
            <span>Serfinanza Action Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {visibleNav(user).map((item) => {
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
            <div className="hidden text-right text-xs text-muted md:block">
              <p className="font-medium text-ink">{user.name}</p>
              <p>{user.title}</p>
            </div>
            <button
              type="button"
              className="focus-ring rounded border border-line bg-white p-2 text-muted hover:bg-surface hover:text-ink"
              onClick={() => {
                clearStoredUser();
                router.replace("/login");
              }}
              aria-label="Cerrar sesion"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
