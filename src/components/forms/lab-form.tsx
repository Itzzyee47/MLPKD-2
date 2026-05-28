"use client";

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

const fieldLabels: Record<string, string> = {
  age: "Age",
  bp: "Blood Pressure (mmHg)",
  sg: "Specific Gravity",
  al: "Albumin",
  su: "Sugar",
  rbc: "Red Blood Cells",
  pc: "Pus Cells",
  pcc: "Pus Cell Clumps",
  ba: "Bacteria",
  bgr: "Blood Glucose Random",
  bu: "Blood Urea",
  sc: "Serum Creatinine",
  sod: "Sodium",
  pot: "Potassium",
  hemo: "Hemoglobin",
  pcv: "Packed Cell Volume",
  wc: "White Blood Cells",
  rc: "Red Blood Count",
  htn: "Hypertension",
  dm: "Diabetes Mellitus",
  cad: "Coronary Artery Disease",
  appet: "Appetite",
  pe: "Pedal Edema",
  ane: "Anemia",
};

const selectFields = {
  rbc: ["normal", "abnormal"],
  pc: ["normal", "abnormal"],
  pcc: ["present", "notpresent"],
  ba: ["present", "notpresent"],
  htn: ["yes", "no"],
  dm: ["yes", "no"],
  cad: ["yes", "no"],
  appet: ["good", "poor"],
  pe: ["yes", "no"],
  ane: ["yes", "no"],
};

type PatientVital = {
  id: string;
  source: "nurse" | "lab";
  created_at: string;
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: string;
  pc: string;
  pcc: string;
  ba: string;
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: string;
  dm: string;
  cad: string;
  appet: string;
  pe: string;
  ane: string;
  notes: string | null;
};

export function LabForm({
  patients,
}: {
  patients: { id: string; full_name: string | null; username: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [allVitals, setAllVitals] = useState<PatientVital[]>([]);
  const [loadingVitals, setLoadingVitals] = useState(false);

  // Load patient vitals when selected (latest first from API)
  useEffect(() => {
    let alive = true;

    if (!selectedPatientId) {
      return;
    }


    setLoadingVitals(true);

    fetch(`/api/vitals/patient/${selectedPatientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        setAllVitals(data.vitals || []);
      })
      .catch(() => {
        if (!alive) return;
        setAllVitals([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoadingVitals(false);
      });

    return () => {
      alive = false;
    };
  }, [selectedPatientId]);


  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);
      const response = await fetch("/api/labs", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save lab values"}`);
      }
    } catch (error) {
      console.error("Lab submission error:", error);
      alert("Failed to submit lab values");
    } finally {
      setLoading(false);
    }
  }

  const hasNurseVitals = allVitals.some((v) => v.source === "nurse");
  const hasLabVitals = allVitals.some((v) => v.source === "lab");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[--color-primary] mb-2">Validate & Submit Lab Values</h2>
        <p className="text-sm text-[--color-muted]">
          Review nurse-submitted vitals and submit your lab analysis.
        </p>
      </div>

      {/* Patient Selection */}
      <div>
        <label className="input-label">Select Patient</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="input"
          required
        >
          <option value="">-- Choose a patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.username}
            </option>
          ))}
        </select>
      </div>

      {/* Existing Vitals History */}
      {selectedPatientId && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[--color-primary]">Patient Vitals History</h3>
          {loadingVitals ? (
            <p className="text-sm text-[--color-muted] py-4">Loading patient vitals...</p>
          ) : allVitals.length === 0 ? (
            <p className="text-sm text-[--color-muted] py-4">No vitals recorded yet for this patient.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allVitals.map((vital) => (
                <div
                  key={vital.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    vital.source === "lab"
                      ? "bg-blue-50 border-blue-300"
                      : "bg-amber-50 border-amber-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {vital.source === "lab" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-semibold">
                          ✓ Lab Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-200 text-amber-800 text-xs font-semibold">
                          ⚠ Nurse Entry
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[--color-muted]">
                      {new Date(vital.created_at).toLocaleDateString()} {new Date(vital.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-[--color-muted] line-clamp-2">
                    Creatinine: {vital.sc} | Hemoglobin: {vital.hemo} | Albumin: {vital.al}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedPatientId && hasNurseVitals && !hasLabVitals && (
        <div className="rounded-lg bg-amber-50 border border-amber-300 p-4">
          <p className="text-sm text-amber-800 font-semibold">
            ⚠ This patient has nurse vitals ready for lab validation. Please review before submitting.
          </p>
        </div>
      )}

      {selectedPatientId && hasLabVitals && (
        <div className="rounded-lg bg-blue-50 border border-blue-300 p-4">
          <p className="text-sm text-blue-800 font-semibold">
            ✓ Lab values have already been submitted for this patient.
          </p>
        </div>
      )}

      {/* Lab Values Grid */}
      {selectedPatientId && (
        <>
          {(() => {
            const latestNurse = allVitals.find((v) => v.source === "nurse");
            if (!latestNurse) {
              return (
                <div className="rounded-lg bg-amber-50 border border-amber-300 p-4">
                  <p className="text-sm text-amber-800 font-semibold">
                    No nurse vitals submitted for this patient yet.
                  </p>
                </div>
              );
            }

            return (
              <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-4 mb-4">
                <p className="text-sm text-emerald-800 font-semibold">
                  ✓ Pre-filled from latest nurse entry for this patient
                </p>
              </div>
            );
          })()}

          {(() => {
            const latestNurse = allVitals.find((v) => v.source === "nurse");
            if (!latestNurse) return null;

            return (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[--color-primary]">Enter Lab Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(defaults).map(([key, defaultValue]) => {
                    const label = fieldLabels[key] || key;
                    const isSelectField = key in selectFields;

                const prefill = (latestNurse as unknown as Record<string, unknown>)[key] as unknown;
                const valueToUse = (prefill ?? defaultValue) as typeof defaultValue;


                    return (
                      <div key={key}>
                        <label htmlFor={key} className="input-label">
                          {label}
                        </label>
                        {isSelectField ? (
                          <select
                            id={key}
                            name={key}
                            defaultValue={String(valueToUse)}
                            className="input"
                            required
                          >
                            {selectFields[key as keyof typeof selectFields].map((option) => (
                              <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : typeof valueToUse === "string" ? (
                          <input
                            id={key}
                            name={key}
                            type="text"
                            defaultValue={String(valueToUse)}
                            className="input"
                            required
                          />
                        ) : (
                          <input
                            id={key}
                            name={key}
                            type="number"
                            step="any"
                            defaultValue={valueToUse}
                            className="input"
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="input-label">
                    Lab Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="input min-h-20"
                    placeholder="Add lab analysis notes or observations..."
                  />
                </div>

                {/* Hidden patient ID field */}
                <input type="hidden" name="patient_id" value={selectedPatientId} />

                {/* Submit Button */}
                <button className="btn-primary w-full py-3 text-base" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Lab Results"}
                </button>
              </div>
            );
          })()}
        </>
      )}
    </form>
  );
}



