import { Sidebar } from "@/components/layout/sidebar";
import { Trend } from "@/components/charts/risk-charts";
import { requireRole } from "@/lib/auth/guards";
import { fetchPredictionsByPatient } from "@/lib/repos/predictions";

export default async function InsightsPage() {
  const { user } = await requireRole(["patient"]);
  const rows = await fetchPredictionsByPatient(user.id);
  const trend = rows.slice().reverse().map((r) => ({ date: new Date(r.created_at).toLocaleDateString(), risk: r.risk_score }));
  const latest = rows[0];

  return <main className="p-4 md:p-6"><div className="md:flex gap-4"><Sidebar role="patient"/><div className="flex-1 space-y-4"><Trend rows={trend}/><div className="card"><h2 className="text-xl font-semibold">Latest Features</h2>{latest ? <pre className="text-xs overflow-auto mt-2">{JSON.stringify(latest.inputs, null, 2)}</pre> : <p className="mt-2">No data yet.</p>}</div><div className="card"><h2 className="text-xl font-semibold">History</h2><div className="space-y-2 mt-3">{rows.map((r)=><details key={r.id} className="rounded-xl bg-[--color-bg] p-3"><summary>{new Date(r.created_at).toLocaleDateString()} - {r.diagnosis} ({r.risk_score}%)</summary><p className="mt-2 text-sm">{r.recommendation}</p></details>)}</div></div></div></div></main>;
}
