import { Apple } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AppIcon, Wordmark } from '@/components/wordmark'

const NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'FAQ', href: '/#faq' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
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

        <Button asChild size="sm" className="rounded-full font-medium">
          <a href="/#download">
            <Apple className="size-4" />
            Download
          </a>
        </Button>
      </div>
    </header>
  )
}
