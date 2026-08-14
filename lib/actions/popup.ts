'use server'

import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface PopupNotification {
  id: string
  title: string
  description: string
  image_url: string | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  max_views: number
  interval_minutes: number
  show_as_popup: boolean
  show_as_banner: boolean
  link_url: string | null
  created_at?: string
  updated_at?: string
}

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
  const eligiblePopups: PopupNotification[] = []

  for (const popup of popups) {
    // Normalize optional fields with defaults if null in DB
    const popupData: PopupNotification = {
      ...popup,
      show_as_popup: popup.show_as_popup ?? true,
      show_as_banner: popup.show_as_banner ?? false,
      link_url: popup.link_url ?? null,
    }

    // Get view history for this popup and session
    const { data: viewHistory } = await supabase
      .from('viewed_popups')
      .select('*')
      .eq('popup_id', popup.id)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    const viewCount = viewHistory?.length || 0

    // Check if max views exceeded (0 = unlimited)
    if (popupData.max_views > 0 && viewCount >= popupData.max_views) {
      continue
    }

    // Check interval (0 = show only once, never again)
    if (viewCount > 0 && viewHistory && viewHistory.length > 0) {
      if (popupData.interval_minutes === 0) {
        // Already shown once, don't show again
        continue
      }

      // Check if enough time has passed since last view
      const lastView = viewHistory[0]
      const lastViewTime = new Date(lastView.created_at).getTime()
      const currentTime = Date.now()
      const minutesPassed = (currentTime - lastViewTime) / 60000

      if (minutesPassed < popupData.interval_minutes) {
        continue
      }
    }

    eligiblePopups.push(popupData)
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

/* ==================== ADMIN ACTIONS ==================== */

export async function getAdminPopups() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('popup_notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin popups:', error)
    return []
  }

  return (data || []).map((popup) => ({
    ...popup,
    show_as_popup: popup.show_as_popup ?? true,
    show_as_banner: popup.show_as_banner ?? false,
    link_url: popup.link_url ?? null,
  })) as PopupNotification[]
}

export async function createPopup(popupData: Partial<PopupNotification>) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('popup_notifications')
    .insert([
      {
        title: popupData.title,
        description: popupData.description,
        image_url: popupData.image_url || null,
        is_active: popupData.is_active ?? true,
        show_as_popup: popupData.show_as_popup ?? true,
        show_as_banner: popupData.show_as_banner ?? false,
        link_url: popupData.link_url || null,
        start_date: popupData.start_date || null,
        end_date: popupData.end_date || null,
        max_views: popupData.max_views ?? 1,
        interval_minutes: popupData.interval_minutes ?? 0,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating popup:', error)
    throw new Error('No se pudo crear la notificación popup.')
  }

  revalidatePath('/')
  revalidatePath('/admin/popups')
  return data
}

export async function updatePopup(id: string, popupData: Partial<PopupNotification>) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('popup_notifications')
    .update({
      title: popupData.title,
      description: popupData.description,
      image_url: popupData.image_url || null,
      is_active: popupData.is_active,
      show_as_popup: popupData.show_as_popup,
      show_as_banner: popupData.show_as_banner,
      link_url: popupData.link_url || null,
      start_date: popupData.start_date || null,
      end_date: popupData.end_date || null,
      max_views: popupData.max_views,
      interval_minutes: popupData.interval_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating popup:', error)
    throw new Error('No se pudo actualizar la notificación popup.')
  }

  revalidatePath('/')
  revalidatePath('/admin/popups')
  return data
}

export async function deletePopup(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from('popup_notifications').delete().eq('id', id)

  if (error) {
    console.error('Error deleting popup:', error)
    throw new Error('No se pudo eliminar la notificación popup.')
  }

  revalidatePath('/')
  revalidatePath('/admin/popups')
  return true
}

export async function togglePopupField(id: string, field: 'is_active' | 'show_as_popup' | 'show_as_banner', value: boolean) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('popup_notifications')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error(`Error toggling ${field}:`, error)
    throw new Error(`No se pudo actualizar el campo ${field}.`)
  }

  revalidatePath('/')
  revalidatePath('/admin/popups')
  return true
}

