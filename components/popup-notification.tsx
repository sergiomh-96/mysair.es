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
        className={`bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-transform duration-300 relative ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
      >
        {/* Image */}
        {popup.image_url && (
          <div className="w-full h-48 overflow-hidden bg-gray-200">
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
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors z-10 shadow-sm"
          title="Cerrar"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">{popup.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">{popup.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {popup.link_url ? (
              <>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Link
                    href={popup.link_url}
                    onClick={handleLinkClick}
                    target={popup.link_url.startsWith('http') ? '_blank' : '_self'}
                    rel={popup.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>Acceder</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

