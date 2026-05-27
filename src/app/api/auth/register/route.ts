import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { username: parsed.data.username } },
  });

  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });

  const passwordHash = await hash(parsed.data.password, 12);

  await supabase.from("profiles").upsert({
    id: data.user.id,
    email: parsed.data.email,
    username: parsed.data.username,
    sex: parsed.data.sex,
    address: parsed.data.address,
    password_hash: passwordHash,
    full_name: parsed.data.full_name,
    role: parsed.data.role,
  });

  return NextResponse.json({ ok: true });
}
