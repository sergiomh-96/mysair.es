import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathname = "/" + params.path.join("/")
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from("url_redirects")
      .select("destination_url, redirect_type")
      .eq("source_path", pathname)
      .eq("is_active", true)
      .maybeSingle()

    if (data) {
      // Increment hit counter fire-and-forget
      supabase
        .rpc("increment_redirect_hits", { path: pathname })
        .catch(() => {})

      return NextResponse.redirect(data.destination_url, {
        status: data.redirect_type || 302,
      })
    }
  } catch (error) {
    console.error("[v0] Redirect handler error:", error)
  }

  return new NextResponse("Not found", { status: 404 })
}
