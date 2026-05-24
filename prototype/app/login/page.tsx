"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
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
      setError("Usuario o contrasena demo invalida.");
      return;
    }
    setStoredUser(user);
    router.replace(routeForRole(user.role));
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center justify-center bg-ink px-8 py-12 text-white">
        <div className="max-w-xl">
          <span className="flex h-12 w-12 items-center justify-center rounded bg-brand text-white">
            <ShieldCheck size={24} />
          </span>
          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-blue-200">Serfinanza Action Hub</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Copiloto contextual para atencion presencial.
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            Ingresa con un rol demo para ver la interfaz correspondiente: asesor, supervisor, administrador o marketing.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-8 py-12">
        <form onSubmit={submit} className="w-full max-w-md rounded border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-surface text-brand">
              <LockKeyhole size={19} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-ink">Inicio de sesion demo</h2>
              <p className="text-sm text-muted">Todos usan contrasena `demo123`.</p>
            </div>
          </div>

          <label className="mt-6 block text-sm font-medium text-ink">
            Usuario
            <select
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded border border-line bg-white px-3 py-2 text-sm"
            >
              {demoUsers.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.email} - {user.title}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-ink">
            Contrasena
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 w-full rounded border border-line bg-white px-3 py-2 text-sm"
            />
          </label>

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

          <div className="mt-6">
            <ActionButton type="submit">Entrar</ActionButton>
          </div>
        </form>
      </section>
    </main>
  );
}
