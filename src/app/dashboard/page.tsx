import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const { profile } = await getSessionProfile();
  if (!profile) redirect("/signin");
  if (profile.role === "doctor") redirect("/doctor");
  if (profile.role === "nurse") redirect("/nurse");
  if (profile.role === "lab_tech") redirect("/lab");
  redirect("/patient");
}
