import { createClient } from "@/lib/supabase/server";

export async function updateOwnProfile(userId: string, payload: { full_name?: string; sex?: "male" | "female" | "other"; address?: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
  if (error) throw error;
}
