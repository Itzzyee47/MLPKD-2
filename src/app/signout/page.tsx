"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/auth/signout", { method: "POST" }).finally(() => {
      router.replace("/signin");
      router.refresh();
    });
  }, [router]);

  return <main className="p-6">Signing out...</main>;
}
