import { Github } from 'lucide-react'

import { AppleLogo } from '@/components/apple-logo'
import { Button } from '@/components/ui/button'
import { AppIcon, Wordmark } from '@/components/wordmark'
import { DOWNLOAD_URL } from '@/lib/links'

const GITHUB_URL = 'https://github.com/christianalares/kommando'

const NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'FAQ', href: '/#faq' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <AppIcon className="size-8" />
          <Wordmark className="text-lg" withCursor={false} />
        </a>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Kommando on GitHub"
            >
              <Github className="size-4" />
            </a>
          </Button>

          <Button asChild size="sm" className="rounded-full font-medium">
            <a href={DOWNLOAD_URL}>
              <AppleLogo className="size-4" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
