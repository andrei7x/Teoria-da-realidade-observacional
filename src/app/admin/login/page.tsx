"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || "Não foi possível entrar.");
    router.push("/admin");
    router.refresh();
  }

  return <main className="login card"><p className="eyebrow">Área administrativa</p><h1>Entrar</h1><form className="admin-form" onSubmit={submit}><label>E-mail<input name="email" type="email" required autoComplete="username" /></label><label>Senha<input name="password" type="password" required autoComplete="current-password" /></label>{error && <p>{error}</p>}<button className="btn primary" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button></form></main>;
}
