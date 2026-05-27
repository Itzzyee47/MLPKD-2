"use client";

import { useState } from "react";
import { BrainCircuit, Save } from "lucide-react";

const defaults = {
  age: 65,
  bp: 140,
  sg: 1.01,
  al: 3,
  su: 2,
  rbc: "abnormal",
  pc: "abnormal",
  pcc: "present",
  ba: "notpresent",
  bgr: 180,
  bu: 58,
  sc: 3.5,
  sod: 132,
  pot: 5.2,
  hemo: 8.5,
  pcv: 26,
  wc: 11000,
  rc: 3.1,
  htn: "yes",
  dm: "yes",
  cad: "yes",
  appet: "poor",
  pe: "yes",
  ane: "yes",
};

const groups = [
  { title: "Vitals", fields: ["age", "bp"] },
  { title: "Renal Markers", fields: ["sg", "al", "su", "bu", "sc"] },
  { title: "Chemistry", fields: ["bgr", "sod", "pot", "hemo"] },
  { title: "Symptoms", fields: ["htn", "dm", "cad", "appet", "pe", "ane"] },
];

const labels: Record<string, string> = {
  age: "Age",
  bp: "Blood pressure",
  sg: "Specific gravity",
  al: "Albumin",
  su: "Sugar",
  bu: "Blood urea",
  sc: "Serum creatinine",
  bgr: "Blood glucose",
  sod: "Sodium",
  pot: "Potassium",
  hemo: "Hemoglobin",
  htn: "Hypertension",
  dm: "Diabetes",
  cad: "Heart disease",
  appet: "Appetite",
  pe: "Edema",
  ane: "Anemia",
};

function Field({ name, value }: { name: string; value: string | number }) {
  return (
    <label className="clinical-field">
      <span>{labels[name]}</span>
      {typeof value === "string" ? (
        <input name={name} defaultValue={value} />
      ) : (
        <input name={name} type="number" step="any" defaultValue={value} />
      )}
    </label>
  );
}

export function PredictionForm({ patients }: { patients: { id: string; full_name: string | null; username: string }[] }) {
  const [result, setResult] = useState<{ risk: number; diagnosis: string; recommendation: string } | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const payload = { ...defaults, ...Object.fromEntries(formData.entries()) };
    const res = await fetch("/api/predictions", { method: "POST", body: JSON.stringify(payload) });
    const json = await res.json();
    if (!res.ok) return setError("Unable to save prediction");
    setError("");
    setResult(json.result);
  }

  return (
    <form action={onSubmit} className="health-panel clinical-form">
      <div className="panel-heading">
        <div>
          <p>Doctor workflow</p>
          <h2>New CKD Prediction</h2>
        </div>
        <BrainCircuit size={22} />
      </div>
      <label className="clinical-field wide">
        <span>Patient</span>
        <select name="patient_id" required>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name ?? patient.username}
            </option>
          ))}
        </select>
      </label>
      {groups.map((group) => (
        <fieldset key={group.title} className="clinical-group">
          <legend>{group.title}</legend>
          <div>
            {group.fields.map((field) => (
              <Field key={field} name={field} value={defaults[field as keyof typeof defaults]} />
            ))}
          </div>
        </fieldset>
      ))}
      <div className="hidden">
        {["rbc", "pc", "pcc", "ba", "pcv", "wc", "rc"].map((field) => (
          <input key={field} name={field} defaultValue={String(defaults[field as keyof typeof defaults])} />
        ))}
      </div>
      <button className="btn-primary" type="submit">
        <Save size={16} />
        Compute & Save
      </button>
      {error && <p className="form-message error">{error}</p>}
      {result && (
        <div className="prediction-result">
          <strong>{result.diagnosis}</strong>
          <span>{result.risk}% risk</span>
          <p>{result.recommendation}</p>
        </div>
      )}
    </form>
  );
}
