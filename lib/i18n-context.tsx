"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import esTranslations from "../locales/es.json"
import enTranslations from "../locales/en.json"
import frTranslations from "../locales/fr.json"
import itTranslations from "../locales/it.json"

type Translations = typeof esTranslations
type Language = "es" | "en" | "fr" | "it"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, any> = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  it: itTranslations,
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
  }

  const t = (key: string) => {
    const keys = key.split(".")
    let value = translations[language]
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        return key
      }
    }
    return value || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
