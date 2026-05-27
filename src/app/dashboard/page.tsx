import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/guards";

const roleConfig: Record<string, { href: string; label: string; icon: string; color: string; desc: string }> = {
  doctor: { href: "/doctor", label: "Doctor Portal", icon: "🩺", color: "from-emerald-500 to-teal-600", desc: "Manage predictions, view analytics, and track patient outcomes" },
  nurse: { href: "/nurse", label: "Nurse Portal", icon: "💊", color: "from-blue-500 to-indigo-600", desc: "Record vitals, submit observations, and view patient history" },
  lab_tech: { href: "/lab", label: "Lab Portal", icon: "🔬", color: "from-purple-500 to-violet-600", desc: "Submit lab results, check reference ranges, and flag abnormals" },
  patient: { href: "/patient", label: "Patient Portal", icon: "🧑", color: "from-amber-500 to-orange-600", desc: "View your diagnosis history, risk trends, and recommendations" },
};

export default async function DashboardPage() {
  const { profile } = await getSessionProfile();
  if (!profile) redirect("/signin");

  const role = roleConfig[profile.role];
  if (!role) redirect("/signin");

  // Auto-redirect to role portal
  redirect(role.href);
}
