import { Sidebar } from "@/components/layout/sidebar";
import { MetricCard } from "@/components/ui/metric-card";
import { requireRole } from "@/lib/auth/guards";
import { fetchPredictionsByPatient } from "@/lib/repos/predictions";

export default async function PatientPage() {
  const { user } = await requireRole(["patient"]);
  const rows = await fetchPredictionsByPatient(user.id);
  const latest = rows[0];
  return <main className="p-4 md:p-6"><div className="md:flex gap-4"><Sidebar role="patient"/><div className="flex-1 space-y-4"><div className="grid md:grid-cols-3 gap-3"><MetricCard label="Total Assessments" value={rows.length}/><MetricCard label="CKD Positives" value={rows.filter((r)=>r.diagnosis==="CKD").length}/><MetricCard label="Latest Risk" value={latest ? `${latest.risk_score}%` : "N/A"}/></div><div className="card"><h2 className="text-xl font-semibold">Latest Diagnosis</h2><p className="mt-2">{latest ? `${latest.diagnosis} on ${new Date(latest.created_at).toLocaleDateString()}` : "No assessments yet"}</p>{latest && <p className="mt-2 text-sm text-[--color-muted]">{latest.recommendation}</p>}</div></div></div></main>;
}
