"use client";

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

export function DoctorRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<DoctorRegisterValues>({
    defaultValues: { role: "nurse", sex: "male" },
  });
  const selectedRole = watch("role");

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setSuccess("");
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
      reset({ role: values.role, sex: values.sex, email: "", password: "", username: "", full_name: "", address: "" });
      setSuccess("Medical personnel account created successfully.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="health-panel">
      <div className="panel-heading">
        <div>
          <p>Registration</p>
          <h2>Register Medical Personnel</h2>
        </div>
      </div>

      <p className="health-subtitle" style={{ marginTop: "-0.4rem", marginBottom: "1rem" }}>
        Doctors can create nurse and lab technician accounts.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
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
                <span className="font-medium capitalize text-[--color-primary]">{role === "lab_tech" ? "Lab Tech" : role}</span>
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

        {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}

export default function DoctorRegisterPage() {
  return (
    <main className="portal-page">
      <DoctorRegisterForm />
    </main>
  );
}
