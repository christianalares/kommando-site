import { cn } from '@/lib/utils'

/**
 * Frames a real Kommando screenshot. The captures already include the app's own
 * window chrome, so we only add a soft border, rounding, and an ambient glow.
 */
export function Screenshot({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  className?: string
}) {
  return (
    <div className={cn('group relative', className)}>
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand/10 opacity-60 blur-3xl" />
      <div className="overflow-hidden rounded-xl border border-border bg-[#0c0c10] shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/10">
        <img
          src={src}
          alt={alt}
          width={1800}
          height={1098}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block w-full"
        />
      </div>
    </div>
  )
}
