import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

// TEMPORARY dev-only helper used to set a Supabase session cookie from a
// manually generated access/refresh token pair, so we can verify UI in the
// browser without a real login form. Deleted after verification.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const accessToken = body.access_token as string | undefined
  const refreshToken = body.refresh_token as string | undefined
  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "missing tokens" }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  return response
}
