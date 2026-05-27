import { PatientWorkspace } from "@/components/portal/role-workspaces";
import { requireRole, getSessionProfile } from "@/lib/auth/guards";
import { fetchPredictionsByPatient } from "@/lib/repos/predictions";

export default async function PatientPage() {
  const roleData = await requireRole(["patient"]);
  const [{ user, profile }, rows] = await Promise.all([
    getSessionProfile(),
    fetchPredictionsByPatient(roleData.user.id),
  ]);

  return (
    <main className="portal-page">
      <PatientWorkspace
        predictions={rows}
        profile={{
          email: profile?.email ?? user.email ?? "",
          full_name: profile?.full_name ?? null,
          sex: (profile?.sex ?? null) as "male" | "female" | "other" | null,
          address: profile?.address ?? null,
        }}
      />
    </main>
  );
}
