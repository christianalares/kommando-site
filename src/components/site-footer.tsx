import { DOWNLOAD_URL } from '@/lib/links'
import { AppIcon, Wordmark } from '@/components/wordmark'

const LINKS = [
  { label: 'Download', href: DOWNLOAD_URL },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'GitHub', href: 'https://github.com/christianalares/kommando' },
  { label: 'Legal', href: '/legal' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AppIcon className="size-9" />
          <div className="flex flex-col">
            <Wordmark className="text-base" withCursor={false} />
            <span className="text-xs text-muted-foreground">
              A native macOS terminal.
            </span>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {LINKS.map((item) => {
            const isExternal = item.href.startsWith('http')
            const isDownload = item.href === DOWNLOAD_URL
            return (
              <a
                key={item.label}
                href={item.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                data-track={isDownload ? 'download' : undefined}
                data-location={isDownload ? 'footer' : undefined}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kommando. Built for macOS.
        </div>
      </div>
    </footer>
  )
}
