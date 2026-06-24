import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'

import { cn } from '@/lib/utils'
import { op } from '@/lib/op'

/**
 * The hero demo reel. Starts paused on a poster with a big play button so it
 * reads as "watch the video"; clicking plays it with sound and native controls.
 *
 * When light-mode variants are provided, the source + poster follow the
 * system color scheme. Browsers ignore `media` on <video><source>, so we pick
 * via matchMedia and react to changes.
 *
 * Analytics: `hero_video_play` when it starts, then `hero_video_progress`
 * milestones (25/50/75/100%) so we can see whether people actually watch it.
 */
const MILESTONES = [25, 50, 75, 100]

export function HeroVideo({
  src,
  srcLight,
  poster,
  posterLight,
  className,
}: {
  src: string
  srcLight?: string
  poster: string
  posterLight?: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [light, setLight] = useState(false)

  const firedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const update = () => setLight(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const activeSrc = light && srcLight ? srcLight : src
  const activePoster = light && posterLight ? posterLight : poster

  function play() {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = false
    video.controls = true
    void video.play()
  }

  function onTimeUpdate() {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) {
      return
    }

    const percent = (video.currentTime / video.duration) * 100
    for (const milestone of MILESTONES) {
      if (percent >= milestone && !firedRef.current.has(milestone)) {
        firedRef.current.add(milestone)
        op.track('hero_video_progress', { percent: milestone })
      }
    }
  }

  return (
    <div className={cn('group relative', className)}>
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-4xl bg-brand/10 opacity-60 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-border bg-[#eceef2] shadow-2xl shadow-black/40 ring-1 ring-inset ring-black/5 dark:bg-[#0c0c10] dark:ring-white/10">
        <video
          ref={videoRef}
          src={activeSrc}
          poster={activePoster}
          playsInline
          preload="metadata"
          className="block w-full cursor-pointer"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={onTimeUpdate}
        />

        {!playing ? (
          <button
            type="button"
            onClick={() => {
              op.track('hero_video_play')
              play()
            }}
            aria-label="Play demo video"
            className="absolute inset-0 flex cursor-pointer items-center justify-center transition hover:bg-black/5"
          >
            <span className="flex size-20 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-xl backdrop-blur-md transition group-hover:scale-105 sm:size-24">
              <Play className="ml-1 size-9 fill-current sm:size-10" />
            </span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
