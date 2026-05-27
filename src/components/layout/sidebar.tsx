"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

const navByRole: Record<Role, { href: string; label: string }[]> = {
  doctor: [
    { href: "/doctor", label: "Doctor Home" },
    { href: "/doctor/prediction", label: "Prediction" },
  ],
  nurse: [{ href: "/nurse", label: "Nurse Portal" }],
  lab_tech: [{ href: "/lab", label: "Lab Portal" }],
  patient: [
    { href: "/patient", label: "Patient Home" },
    { href: "/insights", label: "Insights" },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-64 rounded-2xl bg-white shadow-sm p-4">
      <h2 className="font-semibold text-xl text-[--color-primary]">MLPKD</h2>
      <nav className="mt-4 flex md:block gap-2 overflow-auto">
        {navByRole[role].map((item) => (
          <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-xl ${pathname === item.href ? "bg-[--color-secondary] text-white" : "bg-[--color-bg]"}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link href="/signout" className="mt-6 block text-sm text-[--color-muted]">Sign out</Link>
    </aside>
  );
}
