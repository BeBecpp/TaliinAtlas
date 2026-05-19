"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { AuthFormErrors } from "@/lib/auth/types";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = login(email, password);
    setErrors(result ?? {});
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <p className="rounded-lg border border-atlas-warning/30 bg-atlas-warning/10 px-3 py-2 text-sm text-atlas-warning">
          {errors.general}
        </p>
      )}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-atlas-muted">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-atlas-bg/80 px-4 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-primary/50 focus:ring-2 focus:ring-atlas-primary/20"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-atlas-warning">{errors.email}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-atlas-muted">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-atlas-bg/80 px-4 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-primary/50 focus:ring-2 focus:ring-atlas-primary/20"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-atlas-warning">{errors.password}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Log in
      </button>
    </form>
  );
}
