import { Sidebar } from "@/components/layout/sidebar";
import { VitalsForm } from "@/components/forms/vitals-form";
import { requireRole } from "@/lib/auth/guards";
import { fetchPatients } from "@/lib/repos/predictions";

export default async function NursePage() {
  await requireRole(["nurse"]);
  const patients = await fetchPatients();
  return <main className="p-4 md:p-6"><div className="md:flex gap-4"><Sidebar role="nurse"/><div className="flex-1"><VitalsForm patients={patients}/></div></div></main>;
}
