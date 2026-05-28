import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await context.params;


  const url = new URL(req.url);
  // Note: intentionally do not filter by `source` for patient vitals.
  // const source = url.searchParams.get("source");
  
  try {

    // Validate patientId format
    if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
      return NextResponse.json(
        { error: "Invalid patient ID" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const query = supabase
      .from("vitals")
      .select("*")
      .eq("patient_id", patientId.trim())
      .order("created_at", { ascending: false });



    const { data, error } = await query;

    if (error) {
      console.error("[vitals API] Supabase error:", {
        patientId,
        error: error.message,

        code: error.code,
      });
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ vitals: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[vitals API] Catch error:", { message, patientId });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
