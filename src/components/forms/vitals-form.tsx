"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";

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

type PatientVitals = {
  age?: number;
  bp?: number;
  sg?: number;
  al?: number;
  su?: number;
  rbc?: string;
  pc?: string;
  pcc?: string;
  ba?: string;
  bgr?: number;
  bu?: number;
  sc?: number;
  sod?: number;
  pot?: number;
  hemo?: number;
  pcv?: number;
  wc?: number;
  rc?: number;
  htn?: string;
  dm?: string;
  cad?: string;
  appet?: string;
  pe?: string;
  ane?: string;
  notes?: string;
};

export function VitalsForm({ patients }: { patients: { id: string; full_name: string | null; username: string }[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? "");
  const [patientVitals, setPatientVitals] = useState<PatientVitals>({});
  const [loadingVitals, setLoadingVitals] = useState(false);

  // Load vitals when selected patient changes
  useEffect(() => {
    if (!selectedPatientId) return;
    
    setLoadingVitals(true);
    fetch(`/api/vitals/patient/${selectedPatientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vitals && data.vitals.length > 0) {
          // Use the most recent vitals
          const latest = data.vitals[0];
          setPatientVitals({
            age: latest.age,
            bp: latest.bp,
            sg: latest.sg,
            al: latest.al,
            su: latest.su,
            rbc: latest.rbc,
            pc: latest.pc,
            pcc: latest.pcc,
            ba: latest.ba,
            bgr: latest.bgr,
            bu: latest.bu,
            sc: latest.sc,
            sod: latest.sod,
            pot: latest.pot,
            hemo: latest.hemo,
            pcv: latest.pcv,
            wc: latest.wc,
            rc: latest.rc,
            htn: latest.htn,
            dm: latest.dm,
            cad: latest.cad,
            appet: latest.appet,
            pe: latest.pe,
            ane: latest.ane,
            notes: latest.notes,
          });
        } else {
          // No vitals found, reset to empty
          setPatientVitals({});
        }
      })
      .catch(() => setPatientVitals({}))
      .finally(() => setLoadingVitals(false));
  }, [selectedPatientId]);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await fetch("/api/vitals", { 
      method: "POST", 
      body: JSON.stringify(Object.fromEntries(formData.entries())) 
    });
    window.location.reload();
  }

  const getFieldValue = (fieldName: string): string | number => {
    const fieldKey = fieldName as keyof PatientVitals;
    if (patientVitals[fieldKey] !== undefined) {
      return patientVitals[fieldKey] || "";
    }
    return defaults[fieldName as keyof typeof defaults] || "";
  };

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
        <select 
          name="patient_id" 
          required 
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name ?? patient.username}
            </option>
          ))}
        </select>
      </label>
      {loadingVitals && <p className="form-message">Loading patient vitals...</p>}
      {!loadingVitals && Object.keys(patientVitals).length > 0 && (
        <p className="form-message" style={{ color: "var(--color-success, #10b981)" }}>
          Loading most recent vitals for this patient. Update as needed.
        </p>
      )}
      {groups.map((group) => (
        <fieldset key={group.title} className="clinical-group">
          <legend>{group.title}</legend>
          <div>
            {group.fields.map((field) => (
              <Field 
                key={field} 
                name={field} 
                value={getFieldValue(field)}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <label className="clinical-field wide">
        <span>Notes</span>
        <textarea 
          name="notes" 
          placeholder="Add patient observations"
          defaultValue={patientVitals.notes ?? ""}
        />
      </label>
      <button className="btn-primary" type="submit" disabled={loading || loadingVitals}>
        {loading ? "Saving vitals..." : "Save Vitals"}
      </button>
    </form>
  );
}
