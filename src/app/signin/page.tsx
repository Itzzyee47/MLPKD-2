"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const res = await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify(values) });
    const json = await res.json();
    if (!res.ok) return setError(json.error ?? "Sign in failed");
    router.push("/dashboard");
    router.refresh();
  });

  return (
    <main className="min-h-screen p-6 grid place-items-center"><form onSubmit={onSubmit} className="card w-full max-w-md space-y-3"><h1 className="text-2xl font-semibold">Sign In</h1><input className="input" placeholder="Email" {...register("email")} /><input type="password" className="input" placeholder="Password" {...register("password")} />{error && <p className="text-red-600 text-sm">{error}</p>}<button className="btn-primary w-full" type="submit">Sign in</button></form></main>
  );
}
