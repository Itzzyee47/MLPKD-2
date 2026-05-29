"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DEFAULT_ROLES = [
  { email: "doctor@mlpkd.local", password: "Doctor@123", label: "🩺 Doctor", role: "doctor" },
  { email: "nurse@mlpkd.local", password: "Nurse@123", label: "💊 Nurse", role: "nurse" },
  { email: "lab@gmail.com", password: "Lab@1234", label: "🔬 Lab Tech", role: "lab" },
  { email: "patient@mlpkd.local", password: "Patient@123", label: "🧑 Patient", role: "patient" },
];

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue } = useForm<{ email: string; password: string }>();

  const fillCredentials = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify(values) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Sign in failed"); return; }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="auth-container">
      <div className="auth-bg" />

      {/* Floating orbs */}
      <div className="bg-orb" style={{ width: 200, height: 200, background: "rgba(15,191,160,0.15)", top: "10%", left: "5%" }} />
      <div className="bg-orb" style={{ width: 300, height: 300, background: "rgba(10,138,116,0.1)", bottom: "10%", right: "5%", animationDelay: "3s" }} />

      <div className="auth-card">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white font-bold text-lg shadow-lg">
            M
          </div>
          <span className="text-xl font-bold text-[--color-primary]">MLPKD</span>
        </div>

        <h1 className="text-2xl font-bold text-[--color-primary]">Welcome Back</h1>
        <p className="mt-1 text-sm text-[--color-muted]">Sign in to access your clinical dashboard</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="input-label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="doctor@clinic.com"
              autoComplete="email"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <input
                className="input pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-muted] hover:text-[--color-primary] transition-colors p-2"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15.232 5.027a9.935 9.935 0 018.956 12.885M15.75 9.75L21 3.75" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Quick Select Default Roles */}
          <div>
            <p className="text-xs font-semibold text-[--color-muted] mb-2">Quick Select Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_ROLES.map((role) => (
                <button
                  key={role.email}
                  type="button"
                  onClick={() => fillCredentials(role.email, role.password)}
                  className="px-3 py-2 text-xs rounded-lg border border-[--color-secondary] text-[--color-secondary] hover:bg-[--color-secondary] hover:text-white transition-all duration-200"
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 animate-rise">
              {error}
            </div>
          )}

          <button
            className="btn-primary w-full py-3 text-base"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" /></svg>
                Signing in...
              </span>
            ) : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p className="text-center text-sm text-[--color-muted]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[--color-secondary] hover:underline">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
