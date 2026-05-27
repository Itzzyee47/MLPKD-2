"use client";

import { Save } from "lucide-react";

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
  { title: "Demographics", fields: ["age", "bp"] },
  { title: "Urine Analysis", fields: ["sg", "al", "su", "rbc", "pc", "pcc", "ba"] },
  { title: "Blood Chemistry", fields: ["bgr", "bu", "sc", "sod", "pot"] },
  { title: "Hematology", fields: ["hemo", "pcv", "wc", "rc"] },
  { title: "History & Symptoms", fields: ["htn", "dm", "cad", "appet", "pe", "ane"] },
];

const labels: Record<string, string> = {
  age: "Age",
  bp: "Blood pressure",
  sg: "Specific gravity",
  al: "Albumin",
  su: "Sugar",
  rbc: "Red blood cells",
  pc: "Pus cells",
  pcc: "Pus cell clumps",
  ba: "Bacteria",
  bgr: "Blood glucose",
  bu: "Blood urea",
  sc: "Serum creatinine",
  sod: "Sodium",
  pot: "Potassium",
  hemo: "Hemoglobin",
  pcv: "Packed cell volume",
  wc: "White cell count",
  rc: "Red cell count",
  htn: "Hypertension",
  dm: "Diabetes mellitus",
  cad: "Coronary artery disease",
  appet: "Appetite",
  pe: "Pedal edema",
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

export function VitalsForm({ patients }: { patients: { id: string; full_name: string | null; username: string }[] }) {
  async function onSubmit(formData: FormData) {
    await fetch("/api/vitals", { method: "POST", body: JSON.stringify(Object.fromEntries(formData.entries())) });
    window.location.reload();
  }

  return (
    <form action={onSubmit} className="health-panel clinical-form">
      <div className="panel-heading">
        <div>
          <p>Nurse entry</p>
          <h2>Record Clinical Vitals</h2>
        </div>
        <Save size={22} />
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
      <label className="clinical-field wide">
        <span>Notes</span>
        <textarea name="notes" placeholder="Add patient observations" />
      </label>
      <button className="btn-primary" type="submit">
        Save Vitals
      </button>
    </form>
  );
}
