"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

const navByRole: Record<Role, { href: string; label: string; icon: string }[]> = {
  doctor: [
    { href: "/doctor", label: "Dashboard", icon: "DB" },
    { href: "/doctor/prediction", label: "Predictions", icon: "PR" },
  ],
  nurse: [{ href: "/nurse", label: "Nurse Workspace", icon: "NU" }],
  lab_tech: [{ href: "/lab", label: "Lab Portal", icon: "LB" }],
  patient: [
    { href: "/patient", label: "My Dashboard", icon: "PT" },
    { href: "/insights", label: "Insights", icon: "IN" },
  ],
};

const roleLabels: Record<Role, string> = {
  doctor: "Doctor",
  nurse: "Nurse",
  lab_tech: "Lab Technician",
  patient: "Patient",
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-64 rounded-2xl bg-white/95 shadow-lg p-5 backdrop-blur-sm border border-[rgba(10,138,116,0.06)] md:sticky md:top-4 md:self-start">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[--color-secondary] to-[--color-accent] text-white font-bold shadow">
          M
        </div>
        <span className="text-lg font-bold text-[--color-primary]">MLPKD</span>
      </div>
      <p className="text-xs text-[--color-muted] mb-5 ml-11">{roleLabels[role]} Portal</p>

      <nav className="flex md:block gap-2 overflow-auto">
        {navByRole[role].map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${
                active
                  ? "bg-gradient-to-r from-[--color-secondary] to-[--color-accent] text-white shadow-md"
                  : "text-[--color-primary] hover:bg-[rgba(10,138,116,0.06)]"
              }`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/5 text-[10px] font-semibold">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="divider-gradient mt-5 mb-4" />
      <Link
        href="/signout"
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[--color-muted] hover:text-red-600 hover:bg-red-50 transition-all duration-200"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/5 text-[10px] font-semibold">SO</span> Sign Out
      </Link>
    </aside>
  );
}
