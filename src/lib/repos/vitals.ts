import { createClient } from "@/lib/supabase/server";

export async function createVitals(payload: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("vitals").insert(payload);
  if (error) throw error;
}

export async function fetchVitalsByPatient(patientId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vitals")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function fetchAllVitals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vitals")
    .select("*, patient:profiles!vitals_patient_id_fkey(id,full_name,username,email)")
    .in("source", ["nurse", "lab"])
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}
