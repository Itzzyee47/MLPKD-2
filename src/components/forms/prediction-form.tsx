"use client";

import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Save } from "lucide-react";

type ReadyVitals = {
  id: string;
  patient_id: string;
  created_at: string;
  patient?: { id: string; full_name?: string | null; username?: string | null };
  [key: string]: string | number | null | undefined | object;
};

const labels: Record<string, string> = {
  age: "Age", bp: "Blood pressure", sg: "Specific gravity", al: "Albumin", su: "Sugar", rbc: "RBC", pc: "Pus cells", pcc: "Pus clumps", ba: "Bacteria",
  bgr: "Blood glucose", bu: "Blood urea", sc: "Serum creatinine", sod: "Sodium", pot: "Potassium", hemo: "Hemoglobin", pcv: "PCV", wc: "WBC", rc: "RBC count",
  htn: "Hypertension", dm: "Diabetes", cad: "CAD", appet: "Appetite", pe: "Edema", ane: "Anemia",
};

const fields = ["age","bp","sg","al","su","rbc","pc","pcc","ba","bgr","bu","sc","sod","pot","hemo","pcv","wc","rc","htn","dm","cad","appet","pe","ane"];

export function PredictionForm() {
  const [readyVitals, setReadyVitals] = useState<ReadyVitals[]>([]);
  const [selectedVitalsId, setSelectedVitalsId] = useState("");
  const [result, setResult] = useState<{ risk: number; diagnosis: string; recommendation: string; risk_tier?: string; confidence?: string; model_used?: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/doctor/ready-vitals", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) {
        setReadyVitals(json.ready ?? []);
        if ((json.ready ?? []).length > 0) setSelectedVitalsId(json.ready[0].id);
      }
    })();
  }, []);

  const selected = useMemo(() => readyVitals.find((v) => v.id === selectedVitalsId), [readyVitals, selectedVitalsId]);

  async function submitPrediction() {
    if (!selected) return;
    const payload = { patient_id: selected.patient_id } as Record<string, unknown>;
    fields.forEach((f) => { payload[f] = selected[f] ?? undefined; });

    setLoading(true);
    const res = await fetch("/api/predictions", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error ?? "Unable to save prediction");
    setError("");
    setResult(json.result);
  }

  return (
    <section className="health-panel clinical-form">
      <div className="panel-heading"><div><p>Doctor workflow</p><h2>Run CKD Prediction (Lab-ready queue)</h2></div><BrainCircuit size={22} /></div>
      <p className="health-subtitle">Flow: Nurse records vitals → Lab validates and submits → Doctor predicts from ready records.</p>

      {readyVitals.length === 0 ? <p className="form-message">No lab-ready records yet. Ask lab technician to submit patient analysis.</p> : (
        <>
          <label className="clinical-field wide"><span>Select Lab-Ready Record</span><select value={selectedVitalsId} onChange={(e)=>setSelectedVitalsId(e.target.value)}>
            {readyVitals.map((v) => <option key={v.id} value={v.id}>{v.patient?.full_name ?? v.patient?.username ?? "Patient"} · {new Date(v.created_at).toLocaleString()}</option>)}
          </select></label>
          {selected && <div className="profile-grid">{fields.map((f)=><label key={f}><span className="input-label">{labels[f] ?? f}</span><input className="input" disabled value={String(selected[f] ?? "-")} /></label>)}</div>}
          <button className="btn-primary" type="button" onClick={() => void submitPrediction()} disabled={loading}><Save size={16} /> {loading ? "Running prediction..." : "Run External API Prediction"}</button>
        </>
      )}

      {error && <p className="form-message error">{error}</p>}
      {result && <div className="prediction-result"><strong>{result.diagnosis}</strong><span>{result.risk}% risk · {result.risk_tier ?? "Unknown tier"}</span><p>{result.recommendation}</p><small>Model: {result.model_used ?? "N/A"} · Confidence: {result.confidence ?? "N/A"}</small></div>}
    </section>
  );
}
