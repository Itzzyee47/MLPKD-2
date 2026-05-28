import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requireRole(["lab_tech"]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vitals")
    .select("*, patient:profiles!vitals_patient_id_fkey(id,full_name,username,email)")
    .in("source", ["nurse", "lab"])
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  // Format vitals to include source status for UI display
  const vitalsWithStatus = (data ?? []).map((vital: any) => ({
    ...vital,
    sourceStatus: vital.source === "nurse" ? "not_submitted" : "submitted",
    sourceName: vital.source === "nurse" ? "Nurse Entry (Not Yet Submitted)" : "Lab Submission (Ready for Review)",
  }));
  
  return NextResponse.json({ vitals: vitalsWithStatus });
}
