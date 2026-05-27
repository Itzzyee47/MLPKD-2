import { Sidebar } from "@/components/layout/sidebar";
import { MetricCard } from "@/components/ui/metric-card";
import { PredictionForm } from "@/components/forms/prediction-form";
import { RiskPie, RiskBar } from "@/components/charts/risk-charts";
import { requireRole } from "@/lib/auth/guards";
import { fetchAllPredictions, fetchPatients } from "@/lib/repos/predictions";

export default async function DoctorPage() {
  await requireRole(["doctor"]);
  const [patients, predictions] = await Promise.all([fetchPatients(), fetchAllPredictions()]);
  const ckd = predictions.filter((p) => p.diagnosis === "CKD").length;
  const avgRisk = predictions.length ? Math.round(predictions.reduce((a, c) => a + c.risk_score, 0) / predictions.length) : 0;
  const bar = predictions.slice(0, 8).map((p) => ({ name: p.patient?.full_name ?? p.patient?.username ?? "Patient", risk: p.risk_score }));

  return <main className="p-4 md:p-6"><div className="md:flex gap-4"><Sidebar role="doctor"/><div className="flex-1 space-y-4"><div className="grid md:grid-cols-2 gap-3"><MetricCard label="CKD Count" value={ckd}/><MetricCard label="Average Risk" value={`${avgRisk}%`}/></div><div className="grid md:grid-cols-2 gap-3"><RiskPie ckd={ckd} notCkd={Math.max(0, predictions.length-ckd)} /><RiskBar rows={bar}/></div><PredictionForm patients={patients}/><div className="card overflow-auto"><h2 className="text-xl font-semibold mb-3">Prediction History</h2><table className="w-full text-sm"><thead><tr><th>Patient</th><th>Risk</th><th>Diagnosis</th><th>Date</th></tr></thead><tbody>{predictions.map((p)=><tr key={p.id}><td>{p.patient?.full_name ?? p.patient?.username}</td><td>{p.risk_score}%</td><td>{p.diagnosis}</td><td>{new Date(p.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></div></div></main>;
}
