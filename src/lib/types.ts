export type Role = "doctor" | "nurse" | "lab_tech" | "patient";

export type Profile = {
  id: string;
  email: string;
  username: string;
  role: Role;
  sex: "male" | "female" | "other" | null;
  address: string | null;
  password_hash: string | null;
  full_name: string | null;
  doctor_notes: string | null;
  created_at: string;
};

export type ClinicalRecord = {
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: "normal" | "abnormal";
  pc: "normal" | "abnormal";
  pcc: "present" | "notpresent";
  ba: "present" | "notpresent";
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: "yes" | "no";
  dm: "yes" | "no";
  cad: "yes" | "no";
  appet: "good" | "poor";
  pe: "yes" | "no";
  ane: "yes" | "no";
};

export type PredictionInput = ClinicalRecord;

export type Prediction = {
  id: string;
  patient_id: string;
  doctor_id: string;
  risk_score: number;
  diagnosis: "CKD" | "Not CKD";
  inputs: PredictionInput;
  recommendation: string;
  created_at: string;
};

export type Vitals = {
  id: string;
  patient_id: string;
  entered_by: string;
  source: "nurse" | "lab";
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: "normal" | "abnormal";
  pc: "normal" | "abnormal";
  pcc: "present" | "notpresent";
  ba: "present" | "notpresent";
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: "yes" | "no";
  dm: "yes" | "no";
  cad: "yes" | "no";
  appet: "good" | "poor";
  pe: "yes" | "no";
  ane: "yes" | "no";
  notes: string | null;
  created_at: string;
};
