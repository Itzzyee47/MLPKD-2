import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { registerSchema } from "@/lib/validators";

const doctorPersonnelSchema = registerSchema
  .pick({
    email: true,
    password: true,
    username: true,
    full_name: true,
    sex: true,
    address: true,
    role: true,
  })
  .extend({
    role: z.enum(["nurse", "lab_tech"]),
  });

export async function POST(req: Request) {
  await requireRole(["doctor"]);

  const body = await req.json();
  const parsed = doctorPersonnelSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { username: parsed.data.username, role: parsed.data.role },
  });

  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });

  const { hash } = await import("bcryptjs");
  const passwordHashValue = await hash(parsed.data.password, 12);

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: data.user.id,
    email: parsed.data.email,
    username: parsed.data.username,
    full_name: parsed.data.full_name,
    sex: parsed.data.sex,
    address: parsed.data.address,
    password_hash: passwordHashValue,
    role: parsed.data.role,
  });

  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
