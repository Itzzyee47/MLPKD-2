import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = authSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
