import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth/guards";

export async function GET() {
  await requireRole(["doctor"]);

  // Use service role to avoid RLS edge-cases hiding lab-ready rows from doctors.
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await admin
    .from("vitals")
    .select("*, patient:profiles!vitals_patient_id_fkey(id,full_name,username)")
    .in("source", ["lab", "lab_tech"])
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ready: data ?? [] });
}
