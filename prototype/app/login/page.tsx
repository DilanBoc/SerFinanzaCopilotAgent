"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Zap } from "lucide-react";
import { ActionButton } from "@/components/ui";
import { demoUsers, routeForRole } from "@/lib/auth";
import { setStoredUser } from "@/lib/use-demo-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("asesor@demo.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = demoUsers.find((item) => item.email === email && item.password === password);
    if (!user) {
      setError("Usuario o contraseña demo inválida.");
      return;
    }
    setStoredUser(user);
    router.replace(routeForRole(user.role));
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-onyx lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-midnight to-onyx px-12 py-12 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Zap size={600} className="absolute -top-20 -left-20 text-brand" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-2xl shadow-brand/40">
            <Zap size={32} fill="currentColor" />
          </div>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-brand">Contextual Intelligence</p>
          <h1 className="mt-4 text-7xl font-black tracking-tighter leading-none">
            BOCA
          </h1>
          <p className="mt-6 text-2xl font-bold tracking-tight text-white/90">
            El copiloto inteligente para la banca del futuro.
          </p>
          <p className="mt-4 text-lg text-muted font-medium">
            Atención presencial potenciada por análisis contextual en tiempo real.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-8 py-12 bg-onyx">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-line bg-midnight p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-brand border border-line">
              <LockKeyhole size={24} />
            </span>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-ink uppercase">Acceso BOCA</h2>
              <p className="text-sm font-bold text-muted">Demo Access • <span className="text-brand">demo123</span></p>
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-xs font-black uppercase tracking-widest text-muted">
              Usuario Demo
              <select
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-onyx px-4 py-4 text-sm font-bold text-ink focus:border-brand focus:ring-0 transition-all"
              >
                {demoUsers.map((user) => (
                  <option key={user.id} value={user.email}>
                    {user.email} - {user.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-black uppercase tracking-widest text-muted">
              Contraseña
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-line bg-onyx px-4 py-4 text-sm font-bold text-ink focus:border-brand focus:ring-0 transition-all"
              />
            </label>
          </div>

          {error ? <p className="mt-6 text-sm font-bold text-danger text-center">{error}</p> : null}

          <div className="mt-10">
            <ActionButton type="submit" size="lg" className="w-full py-5 text-lg">ENTRAR AL SISTEMA</ActionButton>
          </div>
        </form>
      </section>
    </main>
  );
}
