import { Sidebar } from "@/components/layout/sidebar";
import { LabForm } from "@/components/forms/lab-form";
import { requireRole } from "@/lib/auth/guards";
import { fetchPatients } from "@/lib/repos/predictions";

export default async function LabPage() {
  await requireRole(["lab_tech"]);
  const patients = await fetchPatients();
  return <main className="p-4 md:p-6"><div className="md:flex gap-4"><Sidebar role="lab_tech"/><div className="flex-1"><LabForm patients={patients}/></div></div></main>;
}
