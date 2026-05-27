import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { z } from "zod";
import { hash } from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  full_name: z.string().min(2),
  sex: z.enum(["male", "female", "other"]),
  address: z.string().min(5),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();
  if (me?.role !== "nurse") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { username: parsed.data.username },
  });
  if (createErr || !created.user) return NextResponse.json({ error: createErr?.message ?? "Failed to create user" }, { status: 400 });

  const passwordHash = await hash(parsed.data.password, 12);

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: created.user.id,
    email: parsed.data.email,
    username: parsed.data.username,
    full_name: parsed.data.full_name,
    sex: parsed.data.sex,
    address: parsed.data.address,
    password_hash: passwordHash,
    role: "patient",
  });

  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
