"use client";
import { useState } from "react";

const defaults = { age:65,bp:140,sg:1.01,al:3,su:2,rbc:"abnormal",pc:"abnormal",pcc:"present",ba:"notpresent",bgr:180,bu:58,sc:3.5,sod:132,pot:5.2,hemo:8.5,pcv:26,wc:11000,rc:3.1,htn:"yes",dm:"yes",cad:"yes",appet:"poor",pe:"yes",ane:"yes" };

export function PredictionForm({ patients }: { patients: { id: string; full_name: string | null; username: string }[] }) {
  const [result, setResult] = useState<{ risk:number; diagnosis:string; recommendation:string } | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/predictions", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) return setError("Unable to save prediction");
    setError("");
    setResult(json.result);
    window.location.reload();
  }

  return <form action={onSubmit} className="card space-y-2"><h2 className="text-xl font-semibold">New Prediction</h2><select name="patient_id" className="input" required>{patients.map(p=><option key={p.id} value={p.id}>{p.full_name ?? p.username}</option>)}</select>{Object.entries(defaults).map(([k,v])=> typeof v === "string" ? <input key={k} name={k} defaultValue={String(v)} className="input"/> : <input key={k} type="number" step="any" name={k} defaultValue={v} className="input"/>)}<button className="btn-primary" type="submit">Compute & Save</button>{error && <p className="text-red-600 text-sm">{error}</p>}{result && <div className="rounded-xl bg-[--color-bg] p-3"><p>Risk: {result.risk}%</p><p>Diagnosis: {result.diagnosis}</p><p>{result.recommendation}</p></div>}</form>;
}
