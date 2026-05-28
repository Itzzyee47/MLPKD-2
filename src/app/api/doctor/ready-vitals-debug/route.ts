import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";

// Debug endpoint: returns lab-ready vitals with patient join and the underlying ids.
// Uses normal createClient to respect RLS.
export async function GET() {
  await requireRole(["doctor"]);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vitals")
    .select("id, patient_id, source, created_at, patient:profiles!vitals_patient_id_fkey(id, full_name, username)")
    .in("source", ["lab", "lab_tech"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ready: data ?? [] });
}

