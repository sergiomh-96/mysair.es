"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink, Film } from "lucide-react"

interface ProductVideo {
  id: number
  title: string
  youtube_url: string
  description?: string
  sort_order: number
}

interface ProductVideosProps {
  videos: ProductVideo[]
}

// Robust extractor for any YouTube URL format including Shorts, mobile, embed, youtu.be
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const clean = url.trim().replace(/["']/g, "")

  // Direct 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean

  // Shorts: /shorts/VIDEO_ID
  const shortsMatch = clean.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i)
  if (shortsMatch) return shortsMatch[1]

  // youtu.be/VIDEO_ID
  const youtuBeMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i)
  if (youtuBeMatch) return youtuBeMatch[1]

  // watch?v=VIDEO_ID or &v=VIDEO_ID
  const vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i)
  if (vMatch) return vMatch[1]

  // embed/VIDEO_ID, live/VIDEO_ID, v/VIDEO_ID
  const pathMatch = clean.match(/\/(?:embed|live|v)\/([a-zA-Z0-9_-]{11})/i)
  if (pathMatch) return pathMatch[1]

  // General fallback: any 11 alphanumeric/dash/underscore token
  const genericMatch = clean.match(/(?:[=/]|%3D)([a-zA-Z0-9_-]{11})(?:[&?/#]|$)/)
  if (genericMatch) return genericMatch[1]

  return null
}

function VideoCardItem({ video }: { video: ProductVideo }) {
  const [hasError, setHasError] = useState(false)
  const videoId = extractYouTubeId(video.youtube_url)
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : video.youtube_url

  // High quality thumbnail URL from YouTube CDN
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null

  return (
    <div className="group flex flex-col justify-between">
      <div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-xl overflow-hidden mb-3 shadow-md border border-slate-200/80 hover:shadow-lg transition-all"
        >
          {thumbnailUrl && !hasError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setHasError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
                <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                </div>
              </div>
            </>
          ) : (
            /* Fallback when thumbnail cannot be loaded: title 15px lower, clean centered design */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
              <div className="w-13 h-13 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              </div>
              <div className="mt-[15px] max-w-[90%]">
                <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-relaxed">
                  {video.title}
                </p>
              </div>
            </div>
          )}
        </a>

        <div className="space-y-1.5 mb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base leading-snug">
            {video.title}
          </h3>

          {video.description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-auto text-xs font-semibold gap-2 border-slate-200 hover:bg-slate-50"
        asChild
      >
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver en YouTube
        </a>
      </Button>
    </div>
  )
}

export function ProductVideos({ videos }: ProductVideosProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-red-600" />
            Videos de instalación y usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {videos.map((video) => (
              <VideoCardItem key={video.id} video={video} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
