import { createServerClient } from "@/lib/supabase/server"
import { getAnalyticsData } from "@/lib/actions/admin-analytics"
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  const [
    { count: productsCount },
    { count: blogsCount },
    { count: messagesCount },
    { count: docsCount },
    { count: popupsCount },
    { count: redirectsCount },
    analyticsData,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("external_links").select("*", { count: "exact", head: true }),
    supabase.from("popup_notifications").select("*", { count: "exact", head: true }),
    supabase.from("url_redirects").select("*", { count: "exact", head: true }),
    getAnalyticsData("30d"),
  ])

  const entityCounts = {
    products: productsCount ?? 0,
    blogs: blogsCount ?? 0,
    messages: messagesCount ?? 0,
    docs: docsCount ?? 0,
    popups: popupsCount ?? 0,
    redirects: redirectsCount ?? 0,
  }

  return (
    <AdminDashboardClient
      initialData={analyticsData}
      entityCounts={entityCounts}
    />
  )
}
