"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, ClipboardList, FileText, Headphones, LogOut, Zap } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-onyx text-muted font-bold tracking-tighter animate-pulse">
        BOCA IS LOADING...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx text-ink">
      <header className="border-b border-line bg-midnight/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-5">
          <Link href={routeForRole(user.role)} className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-electric-violet text-white shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-4xl font-[900] tracking-tighter text-ink bg-clip-text text-transparent bg-gradient-to-r from-white to-muted">
                BOCA
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-2">
              {visibleNav(user).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-muted transition-all hover:bg-surface hover:text-brand"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="flex items-center gap-6 pl-6 border-l border-line">
              <div className="hidden text-right text-xs md:block">
                <p className="font-black text-ink uppercase tracking-tight">{user.name}</p>
                <p className="text-muted font-bold text-[10px] uppercase tracking-wider">{user.title}</p>
              </div>
              <button
                type="button"
                className="focus-ring group flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-midnight text-muted transition-all hover:border-danger hover:text-danger"
                onClick={() => {
                  clearStoredUser();
                  router.replace("/login");
                }}
                aria-label="Cerrar sesion"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-8 py-8">{children}</main>
    </div>
  );
}
