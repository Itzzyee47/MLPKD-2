"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";

const defaults = {
  age: 0,
  bp: 0,
  sg: 0,
  al: 0,
  su: 0,
  rbc: "abnormal",
  pc: "abnormal",
  pcc: "present",
  ba: "notpresent",
  bgr: 0,
  bu: 0,
  sc: 0,
  sod: 0,
  pot: 0,
  hemo: 0,
  pcv: 0,
  wc: 0,
  rc: 0,
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

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const GOOD_POOR = [
  { value: "good", label: "Good" },
  { value: "poor", label: "Poor" },
];

const NORMAL_ABNORMAL = [
  { value: "normal", label: "Normal" },
  { value: "abnormal", label: "Abnormal" },
];

const PRESENT_NOTPRESENT = [
  { value: "present", label: "Present" },
  { value: "notpresent", label: "Not present" },
];


function Field({
  name,
  value,
  options,
}: {
  name: string;
  value: string | number;
  options?: { value: string; label: string }[];
}) {
  const resolvedValue = value ?? "";
  const resolvedString = typeof resolvedValue === "number" ? String(resolvedValue) : resolvedValue;

  return (
    <label className="clinical-field">
      <span>{labels[name]}</span>
      {options ? (
        <select name={name} defaultValue={resolvedString || ""}>
          <option value="" disabled>
            Select...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : typeof value === "string" ? (
        <input name={name} defaultValue={resolvedString || ""} placeholder="" />
      ) : (
        <input name={name} type="number" step="any" defaultValue={resolvedValue === "" ? "" : Number(resolvedValue)} />
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

  // Load latest nurse vitals when selected patient changes
  useEffect(() => {
    let alive = true;

    if (!selectedPatientId) {
      setPatientVitals({});
      return;
    }

    setLoadingVitals(true);
    fetch(`/api/vitals/patient/${selectedPatientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;

        const vitals = (data?.vitals ?? []) as any[];
        const latestNurse = vitals.find((v) => v.source === "nurse") ?? vitals[0];

        if (latestNurse) {
          setPatientVitals({
            age: latestNurse.age,
            bp: latestNurse.bp,
            sg: latestNurse.sg,
            al: latestNurse.al,
            su: latestNurse.su,
            rbc: latestNurse.rbc,
            pc: latestNurse.pc,
            pcc: latestNurse.pcc,
            ba: latestNurse.ba,
            bgr: latestNurse.bgr,
            bu: latestNurse.bu,
            sc: latestNurse.sc,
            sod: latestNurse.sod,
            pot: latestNurse.pot,
            hemo: latestNurse.hemo,
            pcv: latestNurse.pcv,
            wc: latestNurse.wc,
            rc: latestNurse.rc,
            htn: latestNurse.htn,
            dm: latestNurse.dm,
            cad: latestNurse.cad,
            appet: latestNurse.appet,
            pe: latestNurse.pe,
            ane: latestNurse.ane,
            notes: latestNurse.notes,
          });
        } else {
          setPatientVitals({});
        }
      })
      .catch(() => {
        if (!alive) return;
        setPatientVitals({});
      })
      .finally(() => {
        if (!alive) return;
        setLoadingVitals(false);
      });

    return () => {
      alive = false;
    };
  }, [selectedPatientId]);



  async function onSubmit(formData: FormData): Promise<void> {
    setLoading(true);

    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      alert(`Error saving vitals: ${err?.error ? JSON.stringify(err.error) : response.statusText}`);
      setLoading(false);
      return;
    }

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="health-panel clinical-form"
    >

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
        <div className="rounded-lg bg-green-50 border border-green-300 p-3">
          <p className="text-sm text-green-800 font-semibold">
            ✓ Loaded most recent vitals for this patient. Update as needed.
          </p>
        </div>
      )}
      {!loadingVitals && Object.keys(patientVitals).length === 0 && selectedPatientId && (
        <div className="rounded-lg bg-blue-50 border border-blue-300 p-3">
          <p className="text-sm text-blue-800 font-semibold">
            No previous vitals found. Enter new vitals for this patient.
          </p>
        </div>
      )}
      <div key={selectedPatientId + "::" + String(Object.keys(patientVitals).length ? patientVitals.age ?? "loaded" : "empty")}>
        {groups.map((group) => (
          <fieldset key={group.title} className="clinical-group">
            <legend>{group.title}</legend>
            <div>
              {group.fields.map((field) => {
                const value = getFieldValue(field);

                // dropdown wiring for discrete categorical fields
                const options =
                  field === "htn" || field === "dm" || field === "cad" || field === "pe" || field === "ane"
                    ? YES_NO
                    : field === "appet"
                      ? GOOD_POOR
                      : field === "rbc" || field === "pc"
                        ? NORMAL_ABNORMAL
                        : field === "pcc" || field === "ba"
                          ? PRESENT_NOTPRESENT
                          : undefined;

                return (
                  <Field
                    key={field}
                    name={field}
                    value={value}
                    options={options}
                  />
                );
              })}

            </div>
          </fieldset>
        ))}
      </div>

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
