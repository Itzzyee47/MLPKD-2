import { NurseWorkspace } from "@/components/portal/role-workspaces";
import { requireRole, getSessionProfile } from "@/lib/auth/guards";
import { fetchPatients, fetchAllPredictions } from "@/lib/repos/predictions";

export default async function NursePage() {
  await requireRole(["nurse"]);
  const [{ profile }, patients, predictions] = await Promise.all([
    getSessionProfile(),
    fetchPatients(),
    fetchAllPredictions(),
  ]);

  return (
    <main className="portal-page">
      <NurseWorkspace
        patients={patients}
        predictionCount={predictions.length}
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
