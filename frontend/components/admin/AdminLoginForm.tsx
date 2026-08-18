"use client";

import { FormEvent, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ef] px-4">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-[440px] overflow-hidden rounded-[14px] border border-border bg-white p-6 text-center shadow-[0_8px_32px_rgba(28,28,28,0.06)]"
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-rose via-saffron to-rose" />
        <div className="flex items-center justify-center gap-2">
          <BrandLogo compact />
          <span className="rounded-full border border-rose/25 bg-rose/10 px-2.5 py-1 text-[11px] font-bold text-rose">Admin</span>
        </div>
        <h1 className="mt-5 text-xl font-extrabold">تسجيل الدخول</h1>
        <p className="mt-2 text-[13px] leading-6 text-muted">
          لوحة تحكم داخلية لمتجر COD — لا تشارك الرابط أو كلمة المرور.
        </p>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          placeholder="اسم المستخدم"
          className="mt-5 w-full rounded-xl border border-border bg-[#fdfcfc] px-3 py-3 font-english text-sm outline-none focus:border-rose"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="كلمة المرور"
          className="mt-3 w-full rounded-xl border border-border bg-[#fdfcfc] px-3 py-3 font-english text-sm outline-none focus:border-rose"
        />
        {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "كنتحققو…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
