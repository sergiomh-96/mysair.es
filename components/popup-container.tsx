'use client'

import { useState, useEffect } from 'react'
import { PopupNotification } from '@/components/popup-notification'
import { getActivePopups } from '@/lib/actions/popup'

interface PopupNotif {
  id: string
  title: string
  description: string
  image_url: string | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  max_views: number
  interval_minutes: number
}

export function PopupContainer() {
  const [popups, setPopups] = useState<PopupNotif[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [visiblePopups, setVisiblePopups] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPopups() {
      try {
        const { popups: activePopups, sessionId: sid } = await getActivePopups()
        setPopups(activePopups)
        setSessionId(sid)
        // Initially show all eligible popups
        setVisiblePopups(new Set(activePopups.map((p) => p.id)))
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
            <PopupNotification
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
