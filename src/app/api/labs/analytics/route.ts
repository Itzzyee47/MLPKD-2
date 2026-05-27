import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  await requireRole(["lab_tech"]);
  const supabase = await createClient();

  const [{ count: patients }, { count: nurseVitals }, { count: predictions }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "patient"),
    supabase.from("vitals").select("id", { count: "exact", head: true }).eq("source", "nurse"),
    supabase.from("predictions").select("id", { count: "exact", head: true }),
  ]);

  const totalPatients = patients ?? 0;
  const withVitals = Math.min(nurseVitals ?? 0, totalPatients);
  const withPredictions = Math.min(predictions ?? 0, totalPatients);
  const pendingPrediction = Math.max(0, withVitals - withPredictions);
  const pendingVitals = Math.max(0, totalPatients - withVitals);

  return NextResponse.json({ totalPatients, withVitals, withPredictions, pendingPrediction, pendingVitals });
}
