import { getBlogs } from "@/lib/actions/admin-blogs"
import { AdminBlogsClient } from "@/components/admin/admin-blogs-client"

export default async function AdminBlogsPage() {
  const blogs = await getBlogs()
  return <AdminBlogsClient initialBlogs={blogs} />
}
