"use client"

import { useI18n } from "@/lib/i18n-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const languages = [
  { code: "es", display: "ES", label: "Español", flag: "https://flagcdn.com/w40/es.png" },
  { code: "en", display: "EN", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "fr", display: "FR", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "it", display: "IT", label: "Italiano", flag: "https://flagcdn.com/w40/it.png" },
] as const

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const currentLang = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2 hover:bg-slate-800/50 transition-colors group"
        >
          <img 
            src={currentLang?.flag} 
            alt={currentLang?.label} 
            className="w-5 h-auto rounded-sm object-cover border border-slate-700"
          />
          <span className="font-bold text-slate-400 text-base tracking-tight uppercase">
            {currentLang?.display}
          </span>
          <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-white transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-900 border-slate-800 text-slate-200 min-w-[140px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-3 cursor-pointer focus:bg-slate-800 focus:text-white py-2"
          >
            <img 
              src={lang.flag} 
              alt={lang.label} 
              className="w-5 h-auto rounded-sm border border-slate-700" 
            />
            <span className="font-medium">{lang.label}</span>
            {language === lang.code && (
              <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
