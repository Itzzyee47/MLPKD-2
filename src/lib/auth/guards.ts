import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/signin");
  return data.user;
}

export async function requireRole(allowed: Role[]) {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !allowed.includes(profile.role as Role)) redirect("/dashboard");
  return { user, role: profile.role as Role };
}

export async function getSessionProfile() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return { user, profile };
}
