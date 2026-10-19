"use client"

import { useEffect, useState } from "react"
import { Home, ArrowRight, Compass, Package, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"

const COUNTDOWN_SECONDS = 5

export function NotFoundContent() {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const [isPaused, setIsPaused] = useState(false)

  // Temporizador de cuenta regresiva
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused])

  // Redirección infalible a nivel de navegador al terminar la cuenta
  useEffect(() => {
    if (secondsLeft === 0 && !isPaused) {
      window.location.href = "/"
    }
  }, [secondsLeft, isPaused])

  const progressPercentage = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Badge / Code */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Compass className="size-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Error 404 • Página no encontrada</span>
        </div>

        {/* Big 404 Headline with subtle gradient */}
        <div className="space-y-3">
          <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Parece que te has desviado del camino
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            La página que buscas no existe, ha cambiado de dirección o no está disponible temporalmente.
          </p>
        </div>

        {/* Countdown notice & progress */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <span>
              {isPaused ? (
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Redirección pausada
                </span>
              ) : (
                <>
                  Redirigiendo al inicio en{" "}
                  <span className="font-bold text-foreground text-base">{secondsLeft}s</span>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs text-primary hover:underline font-medium cursor-pointer"
            >
              {isPaused ? "Reanudar" : "Pausar cuenta"}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            className="w-full sm:w-auto gap-2 shadow-sm font-medium cursor-pointer"
            asChild
          >
            <a href="/" onClick={() => { window.location.href = "/" }}>
              <Home className="size-4" />
              <span>Volver al inicio ahora</span>
              <ArrowRight className="size-4" />
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 cursor-pointer"
            asChild
          >
            <a href="/productos" onClick={() => { window.location.href = "/productos" }}>
              <Package className="size-4" />
              <span>Ver catálogo</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto gap-2 text-muted-foreground cursor-pointer"
            asChild
          >
            <a href="/contacto" onClick={() => { window.location.href = "/contacto" }}>
              <PhoneCall className="size-4" />
              <span>Contacto</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
