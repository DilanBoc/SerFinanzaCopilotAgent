"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { allowedRoutes, demoUsers, routeForRole, type DemoUser } from "./auth";

const STORAGE_KEY = "serfinanza-action-hub-user";

export function getStoredUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoUser;
    return demoUsers.find((user) => user.id === parsed.id) ?? null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: DemoUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: user.id }));
}

export function clearStoredUser() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function useDemoAuth(options: { requireAuth?: boolean } = { requireAuth: true }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setReady(true);

    if (!options.requireAuth) return;
    if (!stored) {
      router.replace("/login");
      return;
    }
    const routes = allowedRoutes(stored.role);
    const allowed = routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    if (!allowed) router.replace(routeForRole(stored.role));
  }, [options.requireAuth, pathname, router]);

  return { user, ready };
}
