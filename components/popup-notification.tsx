'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'
import { PopupNotification as PopupType, markPopupAsViewed } from '@/lib/actions/popup'

interface PopupNotificationProps {
  popup: PopupType
  sessionId: string
  onClose: (popupId: string) => void
}

export function PopupNotification({ popup, sessionId, onClose }: PopupNotificationProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = async () => {
    setIsClosing(true)
    await markPopupAsViewed(popup.id, sessionId)
    setTimeout(() => {
      onClose(popup.id)
    }, 300)
  }

  const handleLinkClick = async () => {
    setIsClosing(true)
    await markPopupAsViewed(popup.id, sessionId)
    setTimeout(() => {
      onClose(popup.id)
    }, 300)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-[412px] w-full overflow-hidden transform transition-all duration-300 relative border border-slate-200/80 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Image (605x378 aspect ratio preserved) */}
        {popup.image_url && (
          <div className="w-full aspect-[605/378] overflow-hidden bg-slate-100 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={popup.image_url}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20 backdrop-blur-xs shadow-md"
          title="Cerrar"
          aria-label="Cerrar aviso"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h2 className="text-[19px] font-bold mb-1.5 text-gray-900 tracking-tight leading-snug">{popup.title}</h2>
          <p className="text-[13px] text-gray-600 mb-4 leading-relaxed whitespace-pre-line">{popup.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {popup.link_url ? (
              <>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 text-[13px] font-semibold"
                >
                  Cerrar
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold gap-1.5"
                >
                  <Link
                    href={popup.link_url}
                    onClick={handleLinkClick}
                    target={popup.link_url.startsWith('http') ? '_blank' : '_self'}
                    rel={popup.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>Acceder</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleClose}
                size="sm"
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold"
              >
                Aceptar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

