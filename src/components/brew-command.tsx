import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { cn } from '@/lib/utils'
import { BREW_INSTALL_CMD } from '@/lib/links'

/**
 * The Homebrew install one-liner with a copy-to-clipboard button — the second
 * install path alongside the direct download CTA.
 */
export function BrewCommand({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard
      .writeText(BREW_INSTALL_CMD)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => {
        // Clipboard unavailable (e.g. insecure context) — leave the text selectable.
      })
  }

  return (
    <div
      className={cn(
        'flex w-fit max-w-full items-center gap-3 rounded-full border border-border bg-surface px-4 py-2.5 font-mono text-sm',
        className,
      )}
    >
      <span className="select-none text-muted-foreground/60">$</span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-left text-foreground/90">
        {BREW_INSTALL_CMD}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy Homebrew install command"
        className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? (
          <Check className="size-4 text-brand" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </div>
  )
}
