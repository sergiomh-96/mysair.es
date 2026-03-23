'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { markPopupAsViewed } from '@/lib/actions/popup'

interface PopupNotification {
  id: string
  title: string
  description: string
  image_url: string | null
  is_active: boolean
}

interface PopupNotificationProps {
  popup: PopupNotification
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

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-transform duration-300 ${
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
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">{popup.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{popup.description}</p>

          {/* Button */}
          <Button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}
