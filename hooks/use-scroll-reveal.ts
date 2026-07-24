"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setIsVisible(true)
          if (entry.target) {
            observer.unobserve(entry.target)
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "200px 0px 200px 0px",
      },
    )

    const element = ref.current
    if (element) {
      observer.observe(element)
    }

    // Safety fallback: reveal after a short delay so content is never permanently hidden
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 400)

    return () => {
      clearTimeout(timer)
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return { ref, isVisible }
}
