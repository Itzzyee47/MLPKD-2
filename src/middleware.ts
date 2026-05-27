import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const roleMap: Record<string, string[]> = {
  "/doctor": ["doctor"],
  "/nurse": ["nurse"],
  "/lab": ["lab_tech"],
  "/patient": ["patient"],
  "/insights": ["patient"],
};

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const target = Object.keys(roleMap).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!target && pathname !== "/dashboard") return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (pathname === "/dashboard") return response;

  const allowed = roleMap[target!];
  if (!profile || !allowed.includes(profile.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/doctor/:path*", "/nurse/:path*", "/lab/:path*", "/patient/:path*", "/insights"],
};
