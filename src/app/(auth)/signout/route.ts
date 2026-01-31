import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (!error) {
    return NextResponse.redirect(requestUrl.origin + "/login", { status: 302 });
  }

  return NextResponse.redirect(requestUrl.origin + "/login?message=Could not sign out", { status: 302 });
}
