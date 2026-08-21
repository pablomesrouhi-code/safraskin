"use client";

import { FormEvent, useState } from "react";
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
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول. حاول مجدداً.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cod-admin">
      <div className="wrap">
        <div className="panel login-box">
          <a className="brand-lockup" href="/" target="_blank" rel="noopener noreferrer">
            <span className="brand-logo-shell">
              <img className="brand-logo" src="/brand/logo.webp" alt="سفراسكين · Safraskin" width="320" height="140" />
            </span>
            <span className="brand-text">
              <span className="brand-name-ar">سفراسكين</span>
              <span className="brand-name-en">Safraskin</span>
            </span>
            <span className="badge">Admin</span>
          </a>
          <h2>تسجيل الدخول</h2>
          <p>لوحة تحكم داخلية لمتجر COD — لا تشارك الرابط أو كلمة المرور.</p>
          <form onSubmit={onSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" autoComplete="username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" autoComplete="current-password" />
            <button type="submit" className="primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "…" : "دخول"}
            </button>
            {error ? (
              <div className="error" style={{ display: "block" }}>
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
