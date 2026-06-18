import { useEffect, useRef, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * A framed product shot that fades/rises into view on scroll, lifts on hover,
 * and opens in a lightbox when clicked.
 */
export function ShowcaseImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div
        ref={ref}
        className={cn(
          'group/shot relative transition-all duration-700 ease-out',
          shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          className,
        )}
      >
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-4xl bg-brand/10 opacity-60 blur-3xl transition-opacity duration-500 group-hover/shot:opacity-100" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge: ${alt}`}
          className="block w-full origin-center cursor-pointer overflow-hidden rounded-xl border border-border bg-[#0c0c10] shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-brand/10"
        >
          <img
            src={src}
            alt={alt}
            width={1780}
            height={1100}
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
          <span className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/shot:opacity-100">
            <ZoomIn className="size-4" />
          </span>
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-10"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition hover:bg-black/70 hover:text-white"
          >
            <X className="size-5" />
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[94vw] rounded-xl border border-white/10 shadow-2xl"
          />
        </div>
      ) : null}
    </>
  )
}
