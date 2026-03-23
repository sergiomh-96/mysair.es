import { getRedirects } from "@/lib/actions/admin-redirects"
import { AdminRedirectsClient } from "@/components/admin/admin-redirects-client"

export const dynamic = "force-dynamic"

export default async function AdminRedirectsPage() {
  const redirects = await getRedirects()
  return <AdminRedirectsClient redirects={redirects} />
}
