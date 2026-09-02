"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { adminLogin } from "@/lib/actions/admin-auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await adminLogin(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("Error de conexión al verificar credenciales. Inténtalo de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-16 w-auto flex items-center justify-center mb-4">
            <Image
              src="/logo-mysair.png"
              alt="MYSAir - Sistema de zonas y difusión"
              width={260}
              height={65}
              className="h-14 w-auto object-contain drop-shadow-xs"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="text-slate-500 text-xs mt-1">Accede con tus credenciales autorizadas</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@mysair.es"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {loading ? "Accediendo..." : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  )
}
