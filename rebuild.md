
# MLPKD Next.js Rebuild — AI Agent Implementation Spec

## 1) Objective
Build a **Next.js web app** that reproduces the current Streamlit project’s:
- Functional behavior
- Navigation and role-based access
- Visual style and layout
- Data model and workflows

Target parity means users should experience equivalent pages, forms, dashboards, analytics, and role restrictions.

## 2) Source App Summary
Current app is a role-based CKD platform with public pages, role portals, doctor prediction workflow, patient insights, and Supabase-backed storage.

Roles:
- `doctor`
- `nurse`
- `lab_tech`
- `patient`

## 3) Target Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS + custom theme tokens
- Plotly charts (or Recharts)
- Supabase + Postgres
- bcrypt
- Zod + react-hook-form

## 4) Visual Parity Requirements
Theme colors:
- `#063d34`
- `#0a8a74`
- `#0fbfa0`
- `#f7fdfb`
- `#6b7b78`

UI expectations:
- Rounded cards, soft shadows
- Gradient CTA buttons
- Role-aware sidebar for authenticated areas
- Responsive layout behavior on mobile/tablet/desktop

## 5) Required Routes
Public:
- `/`
- `/about`
- `/signin`
- `/register`

Authenticated:
- `/dashboard` (role redirect)
- `/doctor`
- `/doctor/prediction`
- `/nurse`
- `/lab`
- `/patient`
- `/insights` (patient only)

APIs/server actions:
- auth: sign in/register/sign out/session
- users fetch
- predictions CRUD (as needed)
- vitals CRUD (as needed)
- profiles read/update

## 6) Data Model (Mirror Existing)
Tables to support:
- `users`
- `profiles`
- `predictions`
- `vitals`
- `sessions`

Keep current field behavior and role values exactly compatible with existing app.

## 7) Auth & Role Guard Rules
Sign in with username/password, bcrypt compare, create session token, persist in `sessions`, set secure HTTP-only cookie, redirect by role.

Guarding:
- `/doctor*` => doctor only
- `/nurse*` => nurse only
- `/lab*` => lab_tech only
- `/patient*` and `/insights` => patient only

## 8) Key Functional Parity
### Doctor prediction
- Select patient
- Enter clinical inputs
- Compute CKD risk using existing mock formula
- Show result and risk gauge
- Save prediction record
patient_record = {
    # Demographics & Vitals
    'age': 65.0,         # Realistic elderly risk
    'bp': 140.0,         # Hypertension (Stage 2)

    # Urine Analysis (The "Damage" Markers)
    'sg': 1.010,         # Fixed specific gravity (Kidneys lost ability to concentrate)
    'al': 3.0,           # Severe Proteinuria (Scale 0-5)
    'su': 2.0,           # Glucosuria (Sugar in urine due to Diabetes)

    # Qualitative Urine (The "Infection/Inflammation" Markers)
    'rbc': 'abnormal',   # Hematuria (Blood in urine)
    'pc': 'abnormal',    # Pyuria (Pus in urine)
    'pcc': 'present',    # Pus Cell Clumps (Indicates active inflammation)
    'ba': 'notpresent',  # Bacteriuria

    # Blood Chemistry (The "Function" Markers)
    'bgr': 180.0,        # High Blood Glucose (Uncontrolled Diabetes)
    'bu': 58.0,          # Elevated Blood Urea (Normal is < 20)
    'sc': 3.5,           # High Serum Creatinine (Critical marker for Failure)
    'sod': 132.0,        # Hyponatremia (Electrolyte imbalance)
    'pot': 5.2,          # Hyperkalemia (High Potassium - dangerous for heart)

    # Hematology (The "Anemia" Markers)
    'hemo': 8.5,         # Severe Anemia (Kidneys aren't making Erythropoietin)
    'pcv': 26.0,         # Low Packed Cell Volume
    'wc': 11000.0,       # Slightly elevated White Cells (Inflammation)
    'rc': 3.1,           # Low Red Blood Cell count

    # Medical History & Symptoms
    'htn': 'yes',        # Chronic Hypertension
    'dm': 'yes',         # Diabetes Mellitus
    'cad': 'yes',        # Coronary Artery Disease (Common comorbidity)
    'appet': 'poor',     # Uremic symptom (Loss of appetite)
    'pe': 'yes',         # Peripheral Edema (Fluid retention/swelling)
    'ane': 'yes'         # Anemia present
}

CKD count

Average risk

Pie chart (CKD vs Not CKD)

Bar chart (risk by patient)

Full prediction table

Patient insights
Latest diagnosis + date

Total assessments, CKD positives, latest risk

Gauge + trend chart

Latest features table

Doctor notes

Result-based recommendation block

Expandable history

Nurse portal
Record vitals for selected patient

Save + list history

Lab portal
Submit lab values

Show reference ranges and out-of-range flags

9) Components to Build
App shell + sidebar

Auth forms

Metric cards

Risk gauge/trend charts

Prediction and vitals forms

Prediction table and empty states

10) Acceptance Criteria
All routes implemented with correct role protection.

Session persistence across refresh.

Prediction flow saves and appears in doctor + patient views.

Patient insights fully functional.

Nurse/lab workflows functional.

UI closely matches current Streamlit app.

Responsive behavior is polished.

11) Recommended Build Order
Scaffold app + theme

Database schema + repositories

Auth/session middleware

Public pages

Role portals

Prediction + analytics

Patient insights

Nurse/lab workflows

QA parity pass