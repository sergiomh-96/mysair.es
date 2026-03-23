'use server'

import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getActivePopups() {
  const supabase = await createServerClient()
  const now = new Date().toISOString()

  // Get or create session ID
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('popup_session_id')?.value
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get all active popups within date range
  const { data: popups, error } = await supabase
    .from('popup_notifications')
    .select('*')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching popups:', error)
    return { popups: [], sessionId }
  }

  if (!popups || popups.length === 0) {
    return { popups: [], sessionId }
  }

  // Filter popups based on view history and interval
  const eligiblePopups = []

  for (const popup of popups) {
    // Get view history for this popup and session
    const { data: viewHistory } = await supabase
      .from('viewed_popups')
      .select('*')
      .eq('popup_id', popup.id)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    const viewCount = viewHistory?.length || 0

    // Check if max views exceeded (0 = unlimited)
    if (popup.max_views > 0 && viewCount >= popup.max_views) {
      continue
    }

    // Check interval (0 = show only once, never again)
    if (viewCount > 0) {
      if (popup.interval_minutes === 0) {
        // Already shown once, don't show again
        continue
      }

      // Check if enough time has passed since last view
      const lastView = viewHistory[0]
      const lastViewTime = new Date(lastView.created_at).getTime()
      const now = Date.now()
      const minutesPassed = (now - lastViewTime) / 60000

      if (minutesPassed < popup.interval_minutes) {
        continue
      }
    }

    eligiblePopups.push(popup)
  }

  return { popups: eligiblePopups, sessionId }
}

export async function markPopupAsViewed(popupId: string, sessionId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from('viewed_popups').insert([
    {
      popup_id: popupId,
      session_id: sessionId,
    },
  ])

  if (error) {
    console.error('[v0] Error marking popup as viewed:', error)
  }

  // Set session cookie (expires in 30 days)
  const cookieStore = await cookies()
  cookieStore.set('popup_session_id', sessionId, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: 'lax',
  })
}
