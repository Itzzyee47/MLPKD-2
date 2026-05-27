"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Role } from "@/lib/types";

type RegisterFormValues = {
  email: string;
  password: string;
  username: string;
  full_name: string;
  sex: "male" | "female" | "other";
  address: string;
  role: Role;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<RegisterFormValues>();

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(values) });
    const json = await res.json();
    if (!res.ok) return setError(json.error ?? "Registration failed");
    router.push("/signin");
  });

  return (
    <main className="min-h-screen p-6 grid place-items-center">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Register</h1>
        <input className="input" placeholder="Full Name" {...register("full_name")} />
        <input className="input" placeholder="Username" {...register("username")} />
        <input className="input" placeholder="Email" {...register("email")} />
        <input type="password" className="input" placeholder="Password" {...register("password")} />
        <select className="input" {...register("sex")}>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>
        <input className="input" placeholder="Address" {...register("address")} />
        <select className="input" {...register("role")}>
          <option value="doctor">doctor</option>
          <option value="nurse">nurse</option>
          <option value="lab_tech">lab_tech</option>
          <option value="patient">patient</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" type="submit">Create account</button>
      </form>
    </main>
  );
}
