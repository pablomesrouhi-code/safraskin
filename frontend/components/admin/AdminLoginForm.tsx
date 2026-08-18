"use client";

import { FormEvent, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin(username, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "السمية أو كلمة السر غالطين");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-border bg-white p-6 shadow-xl shadow-rose/5"
      >
        <div className="flex justify-center">
          <BrandLogo compact />
        </div>
        <p className="mt-4 text-center text-[10px] font-bold tracking-[0.18em] text-saffron-dark">ADMIN</p>
        <h1 className="mt-1 text-center text-xl font-extrabold">لوحة سفراسكين</h1>
        <p className="mt-1 text-center text-xs text-muted">السمية: admin · كلمة السر: ADMIN_PASSWORD من EasyPanel</p>

        <label className="mt-6 block text-xs text-muted">
          السمية
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2.5 font-english text-sm text-ink outline-none focus:border-saffron"
          />
        </label>
        <label className="mt-3 block text-xs text-muted">
          كلمة السر
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2.5 font-english text-sm text-ink outline-none focus:border-saffron"
          />
        </label>

        {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "كنتحققو…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
