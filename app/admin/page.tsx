import { createServerClient } from "@/lib/supabase/server"
import { Package, FileText, BookOpen, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  const [
    { count: productsCount },
    { count: blogsCount },
    { count: messagesCount },
    { count: docsCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("external_links").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { title: "Productos", value: productsCount ?? 0, icon: Package, href: "/admin/productos", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Documentación", value: docsCount ?? 0, icon: FileText, href: "/admin/documentacion", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Blogs", value: blogsCount ?? 0, icon: BookOpen, href: "/admin/blogs", color: "text-violet-600", bg: "bg-violet-50" },
    { title: "Mensajes", value: messagesCount ?? 0, icon: MessageSquare, href: "/admin/mensajes", color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Bienvenido al panel de administración de MYSAir</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
