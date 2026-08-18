import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// TEMPORARY — dev-only test helper for AI Match verification. Remove before merging.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 })
  }
  const { searchParams, origin } = new URL(request.url)
  const access_token = searchParams.get("access_token")
  const refresh_token = searchParams.get("refresh_token")
  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "missing tokens" }, { status: 400 })
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.setSession({ access_token, refresh_token })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.redirect(`${origin}/admin`)
}
