'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ExternalLink } from 'lucide-react'
import { PopupNotification, getActivePopups, markPopupAsViewed } from '@/lib/actions/popup'

interface PopupBannerProps {
  popup: PopupNotification
  sessionId: string
  onClose?: (popupId: string) => void
}

export function PopupBanner({ popup, sessionId, onClose }: PopupBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = async () => {
    setIsDismissed(true)
    await markPopupAsViewed(popup.id, sessionId)
    if (onClose) {
      onClose(popup.id)
    }
  }

  const handleLinkClick = async () => {
    await markPopupAsViewed(popup.id, sessionId)
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="w-full bg-[rgba(56,189,248,0.3)] backdrop-blur-sm border-b border-sky-300/40 text-red-600 py-2.5 px-10 sm:px-14 transition-all duration-300 relative shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center text-center gap-2.5 text-sm font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-red-600 shrink-0 animate-pulse" />
        <p className="text-red-600 font-semibold sm:font-bold leading-tight text-center">
          {popup.description}
        </p>

        {popup.link_url && (
          <Link
            href={popup.link_url}
            onClick={handleLinkClick}
            target={popup.link_url.startsWith('http') ? '_blank' : '_self'}
            rel={popup.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors shadow-sm shrink-0 ml-1"
          >
            <span>Acceder</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-1 text-red-600 hover:text-red-800 hover:bg-sky-200/50 rounded-md transition-colors"
        title="Cerrar aviso"
        aria-label="Cerrar aviso"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function PopupBannerContainer() {
  const [bannerPopups, setBannerPopups] = useState<PopupNotification[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [visiblePopups, setVisiblePopups] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadBanners() {
      try {
        const { popups, sessionId: sid } = await getActivePopups()
        // Filter popups configured to show in banner
        const activeBanners = popups.filter((p) => p.show_as_banner)
        setBannerPopups(activeBanners)
        setSessionId(sid)
        setVisiblePopups(new Set(activeBanners.map((b) => b.id)))
      } catch (error) {
        console.error('Error loading banner notifications:', error)
      }
    }

    loadBanners()
  }, [])

  const handleCloseBanner = (popupId: string) => {
    setVisiblePopups((prev) => {
      const next = new Set(prev)
      next.delete(popupId)
      return next
    })
  }

  if (bannerPopups.length === 0 || visiblePopups.size === 0) {
    return null
  }

  return (
    <div className="w-full">
      {bannerPopups.map(
        (popup) =>
          visiblePopups.has(popup.id) && (
            <PopupBanner
              key={popup.id}
              popup={popup}
              sessionId={sessionId}
              onClose={handleCloseBanner}
            />
          )
      )}
    </div>
  )
}
