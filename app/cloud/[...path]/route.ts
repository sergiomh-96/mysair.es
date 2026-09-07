import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const pathname = "/" + (resolvedParams?.path || []).join("/")
    const supabase = await createServerClient()
    
    const { data } = await supabase
      .from("url_redirects")
      .select("destination_url, redirect_type")
      .eq("source_path", pathname)
      .eq("is_active", true)
      .maybeSingle()

    if (data) {
      // Increment hit counter fire-and-forget
      void supabase.rpc("increment_redirect_hits", { path: pathname }).then(
        () => {},
        () => {}
      )

      return NextResponse.redirect(data.destination_url, {
        status: data.redirect_type || 302,
      })
    }
  } catch (error) {
    console.error("[v0] Redirect handler error:", error)
  }

  return new NextResponse("Not found", { status: 404 })
}
