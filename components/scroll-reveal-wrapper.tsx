"use client"

import type React from "react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface ScrollRevealWrapperProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
}

export function ScrollRevealWrapper({ children, direction = "up", delay = 0 }: ScrollRevealWrapperProps) {
  const { ref, isVisible } = useScrollReveal()

  const directionClass = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
  }[direction]

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directionClass}`
      }`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  )
}
