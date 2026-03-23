"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminLogout } from "@/lib/actions/admin-auth"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FileText,
  BookOpen,
  MessageSquare,
  LogOut,
  ChevronRight,
  ArrowLeftRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/documentacion", label: "Documentación", icon: FileText },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/admin/redirects", label: "Redirecciones", icon: ArrowLeftRight },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/" className="flex items-center gap-2" target="_blank">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">MYSAir</p>
            <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User info & logout */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="px-3 py-2 mb-2">
          <p className="text-slate-400 text-xs truncate">{userEmail}</p>
        </div>
        <form action={adminLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-3 px-3"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </aside>
  )
}
