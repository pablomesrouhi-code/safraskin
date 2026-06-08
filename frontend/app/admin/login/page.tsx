"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, setAdminToken } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.login(username, password);
      setAdminToken(res.token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sage/5 to-cream">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-border p-8"
      >
        <h1 className="text-2xl font-bold text-sage-dark mb-1">سفرا جلد</h1>
        <p className="text-sm text-gray-500 mb-6">لوحة التحكم — COD Admin</p>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 space-y-1">
            <p>{error}</p>
            {error.includes("Admin API") && (
              <p className="text-xs text-red-500">
                → Easypanel backend-safra: redeploy + ADMIN_USERNAME + ADMIN_PASSWORD + ADMIN_JWT_SECRET
              </p>
            )}
            {error.includes("API_URL") && (
              <p className="text-xs text-red-500">
                → Easypanel frontend-safra: API_URL=https://api.safraskin.online
              </p>
            )}
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-sage/30 outline-none"
          autoComplete="username"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-sage/30 outline-none"
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
