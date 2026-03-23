import { getDocLinks } from "@/lib/actions/admin-docs"
import { AdminDocsClient } from "@/components/admin/admin-docs-client"

export default async function AdminDocumentacionPage() {
  const links = await getDocLinks()
  return <AdminDocsClient initialLinks={links} />
}
