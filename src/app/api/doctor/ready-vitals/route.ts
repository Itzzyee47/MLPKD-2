import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requireRole(["doctor"]);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vitals")
    .select("*, patient:profiles!vitals_patient_id_fkey(id,full_name,username)")
    .eq("source", "lab")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ready: data ?? [] });
}
