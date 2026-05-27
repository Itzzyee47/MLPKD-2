import { DoctorWorkspace } from "@/components/portal/role-workspaces";
import { requireRole, getSessionProfile } from "@/lib/auth/guards";
import { fetchAllPredictions, fetchPatients } from "@/lib/repos/predictions";

export default async function DoctorPage() {
  await requireRole(["doctor"]);
  const [{ profile }, patients, predictions] = await Promise.all([
    getSessionProfile(),
    fetchPatients(),
    fetchAllPredictions(),
  ]);

  return (
    <main className="portal-page">
      <DoctorWorkspace
        patients={patients}
        predictions={predictions}
        profile={{
          email: profile?.email ?? "",
          full_name: profile?.full_name ?? null,
          sex: (profile?.sex ?? null) as "male" | "female" | "other" | null,
          address: profile?.address ?? null,
        }}
      />
    </main>
  );
}
