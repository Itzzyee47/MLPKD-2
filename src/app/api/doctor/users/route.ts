import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const deleteSchema = z.object({
  id: z.string().uuid(),
});

export async function GET() {
  await requireRole(["doctor"]);

  const supabase = await createClient();

  // List all profiles except doctors
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

  // Use service role to delete both auth user + profile row
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // First delete auth user (will cascade delete profile due to FK on profiles.id -> auth.users(id) ON DELETE CASCADE)
  const { error: authErr } = await admin.auth.admin.deleteUser(id);
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

