import { cn } from '@/lib/utils'

export function Wordmark({
  className,
  withCursor = true,
}: {
  className?: string
  withCursor?: boolean
}) {
  return (
    <span
      className={cn(
        'font-mono font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      Kommando
      {withCursor && (
        <span className="cursor-blink ml-0.5 text-accent">_</span>
      )}
    </span>
  )
}

export function AppIcon({ className }: { className?: string }) {
  return (
    <img
      src="/kommando-icon.webp"
      alt="Kommando app icon"
      width={512}
      height={512}
      className={cn('rounded-[22%] shadow-lg shadow-black/40', className)}
    />
  )
}
