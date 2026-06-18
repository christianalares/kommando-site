import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * The hero demo reel. Starts paused on a poster with a big play button so it
 * reads as "watch the video"; clicking plays it with sound and native controls.
 */
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string
  poster: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function play() {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = false
    video.controls = true
    void video.play()
  }

  return (
    <div className={cn('group relative', className)}>
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-4xl bg-brand/10 opacity-60 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-border bg-[#0c0c10] shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          playsInline
          preload="metadata"
          className="block w-full cursor-pointer"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {!playing ? (
          <button
            type="button"
            onClick={play}
            aria-label="Play demo video"
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition hover:bg-black/20"
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
