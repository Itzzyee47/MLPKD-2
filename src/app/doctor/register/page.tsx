"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Role } from "@/lib/types";

type DoctorRegisterValues = {
  email: string;
  password: string;
  username: string;
  full_name: string;
  sex: "male" | "female" | "other";
  address: string;
  role: Extract<Role, "nurse" | "lab_tech">;
};

const roleInfo: Record<Extract<Role, "nurse" | "lab_tech">, { icon: string; desc: string }> = {
  nurse: { icon: "💊", desc: "Record vitals and clinical observations" },
  lab_tech: { icon: "🔬", desc: "Submit lab results with reference ranges" },
};

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm<DoctorRegisterValues>({
    defaultValues: { role: "nurse", sex: "male" },
  });
  const selectedRole = watch("role");

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/doctor/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Registration failed");
        return;
      }
      router.push("/doctor");
      router.refresh();
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="auth-container">
      <div className="auth-bg" />

      <div
        className="bg-orb"
        style={{ width: 250, height: 250, background: "rgba(15,191,160,0.12)", top: "5%", right: "10%" }}
      />
      <div
        className="bg-orb"
        style={{ width: 200, height: 200, background: "rgba(10,138,116,0.08)", bottom: "15%", left: "8%", animationDelay: "2s" }}
      />

      <div className="auth-card" style={{ maxWidth: "32rem" }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white font-bold text-lg shadow-lg">
            M
          </div>
          <span className="text-xl font-bold text-[--color-primary]">MLPKD</span>
        </div>

        <h1 className="text-2xl font-bold text-[--color-primary]">Register Medical Personnel</h1>
        <p className="mt-1 text-sm text-[--color-muted]">Doctors can create nurse and lab technician accounts.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="input-label">Select Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(roleInfo) as (keyof typeof roleInfo)[]).map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 cursor-pointer transition-all duration-200 text-sm ${
                    selectedRole === role
                      ? "border-[--color-secondary] bg-[rgba(10,138,116,0.05)] shadow-sm"
                      : "border-transparent bg-[--color-bg] hover:border-[rgba(10,138,116,0.15)]"
                  }`}
                >
                  <input type="radio" value={role} {...register("role")} className="sr-only" />
                  <span className="text-lg">{roleInfo[role].icon}</span>
                  <span className="font-medium capitalize text-[--color-primary]">
                    {role === "lab_tech" ? "Lab Tech" : role}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-[--color-muted]">{roleInfo[selectedRole]?.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input" placeholder="Jane Smith" {...register("full_name", { required: true })} />
            </div>
            <div>
              <label className="input-label">Username</label>
              <input className="input" placeholder="janesmith" {...register("username", { required: true })} />
            </div>
          </div>

          <div>
            <label className="input-label">Email Address</label>
            <input className="input" type="email" placeholder="jane@clinic.com" {...register("email", { required: true })} />
          </div>

          <div>
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" {...register("password", { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Sex</label>
              <select className="input" {...register("sex", { required: true })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="input-label">Address</label>
              <input className="input" placeholder="City, Country" {...register("address", { required: true })} />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 animate-rise">
              {error}
            </div>
          )}

          <button className="btn-primary w-full py-3 text-base" type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
