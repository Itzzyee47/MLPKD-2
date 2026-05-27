import type { PredictionInput } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function fetchPatients() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id, full_name, username").eq("role", "patient");
  return data ?? [];
}

export async function fetchPredictionsByPatient(patientId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("predictions")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchAllPredictions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("predictions")
    .select("*, patient:profiles!predictions_patient_id_fkey(full_name, username)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createPrediction(patientId: string, doctorId: string, input: PredictionInput, risk_score: number, diagnosis: string, recommendation: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("predictions").insert({
    patient_id: patientId,
    doctor_id: doctorId,
    inputs: input,
    risk_score,
    diagnosis,
    recommendation,
  });
  if (error) throw error;
}
