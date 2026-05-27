import { NextResponse } from "next/server";
import { vitalsSchema } from "@/lib/validators";
import { createVitals } from "@/lib/repos/vitals";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = vitalsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await createVitals({ ...parsed.data, source: "nurse", entered_by: auth.user.id });
  return NextResponse.json({ ok: true });
}
