"use client"

import { useState } from "react"
import Image from "next/image"
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
  Bell,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Images,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavGroup {
  label: string
  items: {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    exact?: boolean
    badge?: string
  }[]
}

const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/productos", label: "Productos", icon: Package },
      { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
      { href: "/admin/documentacion", label: "Documentación", icon: FileText },
    ],
  },
  {
    label: "Comunicación",
    items: [
      { href: "/admin/mensajes", label: "Mensajes", icon: MessageSquare },
      { href: "/admin/popups", label: "Popups y Avisos", icon: Bell },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { href: "/admin/multimedia", label: "Multimedia / Storage", icon: Images },
      { href: "/admin/redirects", label: "Redirecciones", icon: ArrowLeftRight },
    ],
  },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2">
        <Link href="/admin" className="flex items-center gap-2 group flex-1">
          <div className="bg-white py-2 px-3 rounded-xl flex items-center justify-center shadow-xs border border-slate-700/60 group-hover:scale-[1.02] transition-transform w-full">
            <Image
              src="/logo-mysair.png"
              alt="MYSAir Logo"
              width={180}
              height={45}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Ver web pública"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-blue-200" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="px-3 py-2 mb-2 rounded-lg bg-slate-800/50 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Sesión activa</p>
          <p className="text-white text-xs font-medium truncate mt-0.5">{userEmail || "Administrador"}</p>
        </div>
        <form action={adminLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 gap-3 px-3 h-9 text-xs font-medium transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-400" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-9 w-9 p-0 bg-slate-900 border-slate-700 text-white shadow-md"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 w-72 z-40 transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 min-h-screen shrink-0 border-r border-slate-800 sticky top-0 h-screen">
        {sidebarContent}
      </aside>
    </>
  )
}
