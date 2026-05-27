import { NextResponse } from "next/server";
import { predictionSchema } from "@/lib/validators";
import { createPrediction } from "@/lib/repos/predictions";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.KIDNEY_API_BASE_URL ?? "https://web-production-a106d9.up.railway.app";

type ExternalPredictResponse = {
  risk_probability?: number;
  risk_tier?: string;
  recommendations?: string[];
  model_version?: string;
  model_used?: string;
  confidence?: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = predictionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { patient_id, ...inputs } = parsed.data;

  const apiRes = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_data: inputs }),
  });

  const apiJson = (await apiRes.json().catch(() => ({}))) as ExternalPredictResponse & { detail?: string };
  if (!apiRes.ok) {
    return NextResponse.json({ error: apiJson.detail ?? `External predictor error (${apiRes.status})` }, { status: 502 });
  }

  const risk = Math.round((apiJson.risk_probability ?? 0) * 100);
  const diagnosis = risk >= 50 ? "CKD" : "Not CKD";
  const recommendation = (apiJson.recommendations ?? []).join(" ") || `Risk tier: ${apiJson.risk_tier ?? "Unknown"}.`;

  await createPrediction(patient_id, auth.user.id, inputs, risk, diagnosis, recommendation);

  return NextResponse.json({
    ok: true,
    result: {
      risk,
      diagnosis,
      recommendation,
      risk_tier: apiJson.risk_tier,
      confidence: apiJson.confidence,
      model_version: apiJson.model_version,
      model_used: apiJson.model_used,
    },
  });
}
