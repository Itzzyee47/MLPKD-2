import { LabWorkspace } from "@/components/portal/role-workspaces";
import { getSessionProfile, requireRole } from "@/lib/auth/guards";
import { fetchPatients } from "@/lib/repos/predictions";

export default async function LabPage() {
  await requireRole(["lab_tech"]);
  const [{ profile }, patients] = await Promise.all([
    getSessionProfile(),
    fetchPatients(),
  ]);

  return (
    <main className="portal-page">
      <LabWorkspace
        patients={patients}
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
