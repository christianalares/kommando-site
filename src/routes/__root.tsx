import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '@/lib/op'
import appCss from '../styles.css?url'

const SITE_TITLE = 'Kommando — A native macOS terminal with AI built in'
const SITE_DESCRIPTION =
  'Kommando is a native macOS terminal with a built-in AI assistant, split panes, per-project Spaces, command blocks, and a built-in MCP server. Bring your own Anthropic or OpenAI key.'
const SITE_URL = 'https://kommando.app'
const OG_IMAGE = `${SITE_URL}/og.png`
const OG_IMAGE_ALT =
  'Kommando — the terminal that thinks with you. A native macOS terminal with an AI assistant, split panes, Spaces, and a built-in MCP server.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: light)',
        content: '#fcfcfd',
      },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: '#0a0a0c',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Kommando' },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: OG_IMAGE_ALT },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/kommando-icon.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/kommando-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
