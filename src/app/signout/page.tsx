"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    let isMounted = true;

    const performSignout = async () => {
      try {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Sign out failed");
        }

        // Clear any local auth data
        localStorage.removeItem("auth_token");
        sessionStorage.clear();

        // Only redirect if component is still mounted (prevents redirect if already signout)
        if (isMounted) {
          router.replace("/signin");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (isMounted) {
          if (err instanceof Error && err.name === "AbortError") {
            setError("Sign out took too long. Please try again.");
          } else {
            setError("Failed to sign out. Please try again.");
          }
          console.error("Signout error:", err);
        }
      }
    };

    performSignout();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      try {
        controller.abort();
      } catch {
        // Ignore abort errors
      }
    };
  }, [router]);

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-bg" />
        <div className="auth-card text-center" style={{ maxWidth: "24rem" }}>
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white text-2xl shadow-lg">
              !
            </div>
          </div>
          <h1 className="text-xl font-bold text-red-600">Sign Out Error</h1>
          <p className="mt-2 text-sm text-[--color-muted]">{error}</p>
          <button
            onClick={() => window.location.href = "/signin"}
            className="mt-6 px-4 py-2 bg-[--color-primary] text-white rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-bg" />
      <div className="auth-card text-center" style={{ maxWidth: "24rem" }}>
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white text-2xl shadow-lg">
            M
          </div>
        </div>
        <h1 className="text-xl font-bold text-[--color-primary]">Signing Out</h1>
        <p className="mt-2 text-sm text-[--color-muted]">Ending your session securely...</p>
        <div className="mt-6 flex justify-center">
          <svg className="h-8 w-8 animate-spin text-[--color-secondary]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="30 70" />
          </svg>
        </div>
      </div>
    </div>
  );
}
