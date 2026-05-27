"use client";

const defaults = { age:65,bp:140,sg:1.01,al:3,su:2,rbc:"abnormal",pc:"abnormal",pcc:"present",ba:"notpresent",bgr:180,bu:58,sc:3.5,sod:132,pot:5.2,hemo:8.5,pcv:26,wc:11000,rc:3.1,htn:"yes",dm:"yes",cad:"yes",appet:"poor",pe:"yes",ane:"yes" };

export function LabForm({ patients }: { patients: { id: string; full_name: string | null; username: string }[] }) {
  async function onSubmit(formData: FormData) {
    await fetch("/api/labs", { method: "POST", body: JSON.stringify(Object.fromEntries(formData.entries())) });
    window.location.reload();
  }

  return <form action={onSubmit} className="card space-y-2"><h2 className="text-xl font-semibold">Submit Lab Values</h2><select name="patient_id" className="input">{patients.map(p=><option key={p.id} value={p.id}>{p.full_name ?? p.username}</option>)}</select>{Object.entries(defaults).map(([k,v])=> typeof v === "string" ? <input key={k} name={k} defaultValue={String(v)} className="input"/> : <input key={k} type="number" step="any" name={k} defaultValue={v} className="input"/>)}<textarea name="notes" className="input" placeholder="Notes"/><button className="btn-primary" type="submit">Save</button></form>;
}
