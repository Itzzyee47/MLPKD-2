"use client";

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

export function LabForm({
  patients,
}: {
  patients: { id: string; full_name: string | null; username: string }[];
}) {
  async function onSubmit(formData: FormData) {
    try {
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
    }
  }

  return (
    <form action={onSubmit} className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[--color-primary] mb-2">Submit Lab Values</h2>
        <p className="text-sm text-[--color-muted]">
          Enter clinical lab results for a patient. All fields are required.
        </p>
      </div>

      {/* Patient Selection */}
      <div>
        <label className="input-label">Select Patient</label>
        <select name="patient_id" className="input" required>
          <option value="">-- Choose a patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.username}
            </option>
          ))}
        </select>
      </div>

      {/* Lab Values Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[--color-primary]">Clinical Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(defaults).map(([key, defaultValue]) => {
            const label = fieldLabels[key] || key;
            const isSelectField = key in selectFields;

            return (
              <div key={key}>
                <label htmlFor={key} className="input-label">
                  {label}
                </label>
                {isSelectField ? (
                  <select
                    id={key}
                    name={key}
                    defaultValue={String(defaultValue)}
                    className="input"
                    required
                  >
                    {selectFields[key as keyof typeof selectFields].map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : typeof defaultValue === "string" ? (
                  <input
                    id={key}
                    name={key}
                    type="text"
                    defaultValue={String(defaultValue)}
                    className="input"
                    required
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    type="number"
                    step="any"
                    defaultValue={defaultValue}
                    className="input"
                    required
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="input-label">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          className="input min-h-20"
          placeholder="Add any relevant notes about these lab results..."
        />
      </div>

      {/* Submit Button */}
      <button className="btn-primary w-full py-3 text-base" type="submit">
        Save Lab Results
      </button>
    </form>
  );
}

