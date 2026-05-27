import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { createVitals } from "@/lib/repos/vitals";

const schema = z.object({ vitals_id: z.string().uuid(), notes: z.string().max(400).optional() });

export async function POST(req: Request) {
  const { user } = await requireRole(["lab_tech"]);
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.from("vitals").select("*").eq("id", parsed.data.vitals_id).eq("source", "nurse").single();
  if (error || !data) return NextResponse.json({ error: "Nurse vitals record not found" }, { status: 404 });

  const { id, created_at, source, entered_by, ...rest } = data;
  await createVitals({ ...rest, notes: parsed.data.notes ?? data.notes, source: "lab", entered_by: user.id });
  return NextResponse.json({ ok: true });
}
