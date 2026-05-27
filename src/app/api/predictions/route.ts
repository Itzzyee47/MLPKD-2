import { NextResponse } from "next/server";
import { predictionSchema } from "@/lib/validators";
import { computeRisk } from "@/lib/risk";
import { createPrediction } from "@/lib/repos/predictions";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = predictionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { patient_id, ...inputs } = parsed.data;
  const result = computeRisk(inputs);
  await createPrediction(patient_id, auth.user.id, inputs, result.risk, result.diagnosis, result.recommendation);
  return NextResponse.json({ ok: true, result });
}
