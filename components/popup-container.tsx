'use client'

import { useState, useEffect } from 'react'
import { PopupNotification as PopupComponent } from '@/components/popup-notification'
import { PopupNotification, getActivePopups } from '@/lib/actions/popup'

export function PopupContainer() {
  const [popups, setPopups] = useState<PopupNotification[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [visiblePopups, setVisiblePopups] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPopups() {
      try {
        const { popups: activePopups, sessionId: sid } = await getActivePopups()
        // Only show modal popups that have show_as_popup set to true
        const modalPopups = activePopups.filter((p) => p.show_as_popup !== false)
        setPopups(modalPopups)
        setSessionId(sid)
        setVisiblePopups(new Set(modalPopups.map((p) => p.id)))
      } catch (error) {
        console.error('[v0] Error loading popups:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopups()
  }, [])

  const handleClosePopup = (popupId: string) => {
    setVisiblePopups((prev) => {
      const newSet = new Set(prev)
      newSet.delete(popupId)
      return newSet
    })
  }

  if (isLoading || visiblePopups.size === 0) {
    return null
  }

  return (
    <>
      {popups.map(
        (popup) =>
          visiblePopups.has(popup.id) && (
            <PopupComponent
              key={popup.id}
              popup={popup}
              sessionId={sessionId}
              onClose={handleClosePopup}
            />
          )
      )}
    </>
  )
}
