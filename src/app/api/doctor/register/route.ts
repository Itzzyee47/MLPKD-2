import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { registerSchema } from "@/lib/validators";
import { createClient } from "@/lib/supabase/server";

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
  const allowed = ["doctor"] as const;

  // Ensure only doctors can access this endpoint
  await requireRole([...allowed]);

  const body = await req.json();
  const parsed = doctorPersonnelSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Create the auth user
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username, role: parsed.data.role },
    },
  });

  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });

  // Persist profile row (including role)
  // That route uses bcryptjs hashing; we replicate it here to keep stored credentials consistent.
  const { hash } = await import("bcryptjs");
  const passwordHashValue = await hash(parsed.data.password, 12);

  const { error: profileErr } = await supabase.from("profiles").upsert({
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
