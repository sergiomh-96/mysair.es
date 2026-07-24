"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, Settings, Check, X, Shield, Info } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

const COOKIE_CONSENT_KEY = "mysair_cookie_consent"

export interface CookieConsentState {
  essential: boolean
  analytics: boolean
  timestamp: string
}

export function CookieBanner() {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analyticsConsent, setAnalyticsConsent] = useState(true)

  useEffect(() => {
    setMounted(true)
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!storedConsent) {
      setIsVisible(true)
    } else {
      try {
        const parsed: CookieConsentState = JSON.parse(storedConsent)
        setAnalyticsConsent(parsed.analytics)
      } catch (e) {
        setIsVisible(true)
      }
    }

    const handleOpenSettings = () => {
      setIsVisible(true)
      setShowModal(true)
    }

    window.addEventListener("open-cookie-settings", handleOpenSettings)
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings)
    }
  }, [])

  const updateGtagConsent = (analyticsGranted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("consent", "update", {
        analytics_storage: analyticsGranted ? "granted" : "denied",
      })
    }
  }

  const saveConsent = (analytics: boolean) => {
    const consentState: CookieConsentState = {
      essential: true,
      analytics,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState))
    updateGtagConsent(analytics)
    setIsVisible(false)
    setShowModal(false)
  }

  const handleAcceptAll = () => {
    saveConsent(true)
  }

  const handleRejectOptional = () => {
    saveConsent(false)
  }

  const handleSavePreferences = () => {
    saveConsent(analyticsConsent)
  }

  if (!mounted || !isVisible) return null

  return (
    <>
      {/* Full-width Bottom Cookie Banner */}
      {!showModal && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t("cookies.title")}
          className="fixed bottom-0 inset-x-0 w-full z-50 bg-gray-900/95 backdrop-blur-md text-white border-t border-gray-800 shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl flex-shrink-0 mt-0.5">
                <Cookie className="h-6 w-6" />
              </div>
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-base text-white">
                    {t("cookies.title")}
                  </h3>
                  <Link
                    href="/politica-cookies"
                    className="text-blue-400 hover:text-blue-300 underline font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <Info className="h-3.5 w-3.5" />
                    {t("cookies.more_info")}
                  </Link>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed max-w-5xl">
                  {t("cookies.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-all shadow-md hover:shadow-blue-600/20 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Check className="h-4 w-4" />
                {t("cookies.accept_all")}
              </button>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-xs rounded-xl transition-all border border-gray-700 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {t("cookies.reject_optional")}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs rounded-xl transition-all border border-gray-700 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                aria-label={t("cookies.settings")}
              >
                <Settings className="h-4 w-4" />
                <span>{t("cookies.settings")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-gray-900 text-white border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{t("cookies.settings_title")}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  if (localStorage.getItem(COOKIE_CONSENT_KEY)) {
                    setIsVisible(false)
                  }
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Options list */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Essential Cookies (Mandatory) */}
              <div className="bg-gray-800/60 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-200 flex items-center gap-2">
                    {t("cookies.essential_title")}
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {t("cookies.always_active")}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t("cookies.essential_desc")}
                </p>
              </div>

              {/* Analytics Cookies (Optional) */}
              <div className="bg-gray-800/60 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-200">
                    {t("cookies.analytics_title")}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsConsent}
                      onChange={(e) => setAnalyticsConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t("cookies.analytics_desc")}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800">
              <Link
                href="/politica-cookies"
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                onClick={() => {
                  setShowModal(false)
                  setIsVisible(false)
                }}
              >
                {t("cookies.privacy_policy")}
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition-colors border border-gray-700"
                >
                  {t("cookies.reject_optional")}
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl transition-colors shadow-md hover:shadow-blue-600/20"
                >
                  {t("cookies.save_preferences")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
