import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(req: Request) {
  await requireRole(["doctor"]);

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id,full_name,username,role")
      .eq("id", userId)
      .single();

    if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

    const { data: predictions, error: predictionError } = await supabase
      .from("predictions")
      .select("id,risk_score,diagnosis,recommendation,created_at")
      .eq("patient_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (predictionError) return NextResponse.json({ error: predictionError.message }, { status: 400 });

    return NextResponse.json({ user, predictions: predictions ?? [] });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,username,full_name,role,created_at")
    .neq("role", "doctor")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ users: data ?? [] });
}

export async function DELETE(req: Request) {
  await requireRole(["doctor"]);

  const body = await req.json();
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { id } = parsed.data;

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { error: authErr } = await admin.auth.admin.deleteUser(id);
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
