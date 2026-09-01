import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/actions/admin-auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Admin Panel | MYSAir",
  description: "Panel de administración de MYSAir.",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin-login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar userEmail={session.email ?? ""} />
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  )
}
