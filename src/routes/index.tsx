import { createFileRoute } from '@tanstack/react-router'
import {
  Blocks,
  Columns2,
  Cpu,
  KeyRound,
  LayoutGrid,
  MousePointerClick,
  Palette,
  Plug,
  Sparkles,
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

import { cn } from '@/lib/utils'
import { DOWNLOAD_URL } from '@/lib/links'
import { AppleLogo } from '@/components/apple-logo'
import { CommandDrift } from '@/components/command-drift'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeroVideo } from '@/components/hero-video'
import { ShowcaseImage } from '@/components/showcase-image'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { AppIcon, Wordmark } from '@/components/wordmark'

export const Route = createFileRoute('/')({ component: Home })

type Feature = {
  icon: LucideIcon
  title: string
  body: string
}

const FEATURES: Array<Feature> = [
  {
    icon: Cpu,
    title: 'Native, not Electron',
    body: 'Built in SwiftUI for Apple silicon. Real macOS windows, system menus, vibrant chrome, and none of the Electron bloat.',
  },
  {
    icon: Sparkles,
    title: 'AI in the sidebar',
    body: 'An assistant that already sees your working directory and on-screen output — ask questions in context.',
  },
  {
    icon: KeyRound,
    title: 'BYOK',
    body: 'Bring your own Anthropic or OpenAI key. It is stored in the macOS Keychain and only ever talks to your provider.',
  },
  {
    icon: Columns2,
    title: 'Split panes & tabs',
    body: 'Tile terminals into a tree of panes and tabs — then drag to reorder, split, or pop a pane out into its own tab.',
  },
  {
    icon: LayoutGrid,
    title: 'Spaces per project',
    body: 'Group tabs and panes into Spaces — one per project — and switch between them in a keystroke, each with its own colour and folder.',
  },
  {
    icon: Blocks,
    title: 'Command blocks',
    body: 'Click any past command to select it with its output, then ⌘C to copy. The shell integration installs itself — no setup.',
  },
  {
    icon: MousePointerClick,
    title: 'Clickable links & paths',
    body: '⌘-click URLs and real file paths right in your output. Paths are verified against the working directory, so only real files light up.',
  },
  {
    icon: Plug,
    title: 'Built-in MCP server',
    body: 'Expose your panes over MCP so any MCP-aware assistant can run commands, open panes, and read output — right in your real terminal.',
  },
  {
    icon: Palette,
    title: 'Theme Studio',
    body: 'Craft custom terminal themes — all 16 ANSI colors plus background, foreground and cursor — with a live preview and light/dark variants.',
  },
]

type Showcase = {
  eyebrow: string
  title: string
  body: string
  points: Array<string>
  image: string
  imageLight: string
  alt: string
}

const SHOWCASES: Array<Showcase> = [
  {
    eyebrow: 'The AI sidebar',
    title: 'An assistant that works your shell.',
    body: 'It reads the live output of the focused pane, then drops a command straight into your prompt. Review it and hit Enter — or let it auto-run when you opt in.',
    points: [
      'Reads your terminal output and working directory',
      'Inserts commands you review, or auto-runs on your terms',
      'Bring your own Anthropic or OpenAI key',
    ],
    image: '/img/feature-ai.webp',
    imageLight: '/img/feature-ai-light.webp',
    alt: 'Kommando AI sidebar inserting and running shell commands',
  },
  {
    eyebrow: 'Command blocks',
    title: 'Every command is a block you can grab.',
    body: 'Kommando marks where each command starts and ends, so you can click any past command to select it together with its output — then ⌘C to copy the whole thing. Zero setup; the shell integration installs itself.',
    points: [
      'Click a past command to highlight it and its output',
      '⌘C copies the command and output together',
      'A green or red edge marks success or failure',
    ],
    image: '/img/feature-commandblocks.webp',
    imageLight: '/img/feature-commandblocks-light.webp',
    alt: 'Kommando highlighting a past command block with a Copied confirmation',
  },
  {
    eyebrow: 'Panes & tabs',
    title: 'Split your workspace any way you like.',
    body: 'Tile terminals into a tree of panes and group them into tabs. Keep your server, logs, and a scratch shell side by side in a single window.',
    points: [
      'Drag tabs to reorder, or into the canvas to split',
      'Drag panes to rearrange or pop them into a new tab',
      'Rename tabs and find across any pane instantly',
    ],
    image: '/img/feature-panes.webp',
    imageLight: '/img/feature-panes-light.webp',
    alt: 'Kommando showing four terminals tiled into split panes',
  },
  {
    eyebrow: 'Spaces',
    title: 'A separate workspace for every project.',
    body: 'Group your tabs and panes into Spaces — one per project. Switch between them in a keystroke, each with its own colour and default folder, while background shells keep running.',
    points: [
      'One set of tabs and panes per Space',
      'Switch instantly from the title bar or with ⌘E',
      'Per-Space colour and default working folder',
    ],
    image: '/img/feature-spaces.webp',
    imageLight: '/img/feature-spaces-light.webp',
    alt: 'Kommando title-bar Spaces switcher listing project workspaces',
  },
  {
    eyebrow: 'Make it yours',
    title: 'Custom commands and shortcuts.',
    body: 'Save the commands you run constantly, bind them to a keystroke, and choose whether they run immediately. Tune appearance, the terminal, and AI from one settings panel.',
    points: [
      'Saved commands with custom keyboard shortcuts',
      'Run immediately or drop into the prompt',
      'Appearance, terminal, and shortcut settings',
    ],
    image: '/img/feature-commands.webp',
    imageLight: '/img/feature-commands-light.webp',
    alt: 'Kommando settings showing custom commands with keyboard shortcuts',
  },
  {
    eyebrow: 'Built-in MCP server',
    title: 'Let other AI apps drive your terminal.',
    body: 'Kommando exposes its panes over MCP, so any MCP-aware assistant can run commands, open new panes, and read the output — right inside your real terminal session.',
    points: [
      'Run commands and open panes from any MCP client',
      'The agent sees real output and acts on it',
      'You stay in control of what connects',
    ],
    image: '/img/feature-mcp.webp',
    imageLight: '/img/feature-mcp-light.webp',
    alt: 'Another AI app running commands in Kommando over its MCP server',
  },
  {
    eyebrow: 'Theme Studio',
    title: 'Design a terminal that looks like yours.',
    body: 'Dial in the background, foreground, cursor and all 16 ANSI colors with a live preview that exercises every slot. Give a theme separate light and dark palettes and it follows your system automatically.',
    points: [
      'Edit 16 ANSI colors plus background, foreground and cursor',
      'Live preview catches washed-out colors before you commit',
      'Per-theme light and dark variants that follow the system',
    ],
    image: '/img/feature-theme.webp',
    imageLight: '/img/feature-theme-light.webp',
    alt: 'Kommando Theme Studio editing the Aurora theme with a live preview',
  },
]

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How much does Kommando cost?',
    a: 'Kommando is a one-time download for macOS. There is no subscription for the terminal itself — if you use the AI assistant you pay your provider directly for your own usage.',
  },
  {
    q: 'Do I need an API key to use the AI?',
    a: 'Yes. The assistant uses your own Anthropic or OpenAI key, so you stay in full control of usage and billing. The terminal works great without one too.',
  },
  {
    q: 'Where is my API key stored?',
    a: 'Your key is stored in the macOS Keychain and is only ever sent directly to the provider you chose. It never touches a Kommando server.',
  },
  {
    q: 'Does the assistant run commands on its own?',
    a: 'Only if you let it. By default suggested commands are inserted into your prompt for you to review and run. Turn on “auto-run generated commands” when you want it to execute them for you.',
  },
  {
    q: 'Does Kommando update itself?',
    a: 'Yes. Kommando has built-in auto-updates (via Sparkle) — it checks for new versions on launch and can install them automatically, or you can trigger a check from the menu. Builds are Developer ID-signed and notarized.',
  },
  {
    q: 'Which Mac do I need?',
    a: 'Kommando requires macOS 26 (Tahoe) or later and runs natively on Apple silicon.',
  },
]

function Home() {
  return (
    <div id="top" className="relative">
      <BackgroundGlow />
      <CommandDrift />
      <SiteHeader />

      <main>
        <Hero />
        <Features />
        <Showcases />
        <Faq />
        <DownloadCta />
      </main>

      <SiteFooter />
    </div>
  )
}

function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Irregular, off-center light — deliberately not the symmetric centered halo. */}
      <div className="absolute -left-32 -top-40 size-152 rounded-full bg-brand/12 blur-[140px]" />
      <div className="absolute right-[6%] top-[22%] size-104 rounded-full bg-brand/6 blur-[130px]" />
      <div className="absolute -bottom-72 left-[18%] size-128 rounded-full bg-brand/5 blur-[150px]" />
    </div>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-border bg-surface px-3 py-1 text-muted-foreground"
        >
          <Sparkles className="size-3 text-brand" />
          A terminal with AI built in
        </Badge>

        <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          The terminal that
          <br className="hidden sm:block" /> thinks with you.
        </h1>

        <p className="mt-5 text-balance text-lg text-muted-foreground">
          <Wordmark withCursor={false} className="font-semibold" /> is a native
          macOS terminal with a built-in AI assistant, split panes & tabs, and a
          Space for every project.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 text-base font-medium"
          >
            <a href={DOWNLOAD_URL} data-track="download" data-location="hero">
              <AppleLogo className="size-5" />
              Download for macOS
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full px-6 text-base text-muted-foreground hover:text-foreground"
          >
            <a href="#features">See what it does →</a>
          </Button>
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          macOS 26+ · Apple silicon · No account required
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl">
        <HeroVideo
          src="/kommando-demo.mp4"
          srcLight="/kommando-demo-light.mp4"
          poster="/img/hero-poster.webp"
          posterLight="/img/hero-poster-light.webp"
        />
      </div>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 border-y border-border bg-card/40 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you reach for, in one window"
          subtitle="A genuinely native Mac terminal that folds in the tools you usually juggle across three other apps."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, body }: Feature) {
  return (
    <div className="group bg-background p-7 transition-colors hover:bg-card">
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-brand transition-colors group-hover:border-brand/40">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}

function Showcases() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-24 py-12">
        {SHOWCASES.map((showcase, i) => (
          <ShowcaseRow
            key={showcase.title}
            showcase={showcase}
            index={i}
            flip={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  )
}

function ShowcaseRow({
  showcase,
  index,
  flip,
}: {
  showcase: Showcase
  index: number
  flip: boolean
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-5 md:gap-14">
      <div className={cn('md:col-span-2', flip && 'md:order-2')}>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          <span className="text-sm text-muted-foreground/50">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="h-px w-6 bg-border" />
          {showcase.eyebrow}
        </div>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {showcase.title}
        </h2>
        <p className="mt-5 text-muted-foreground">{showcase.body}</p>

        <ul className="mt-8 space-y-4">
          {showcase.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <ShowcaseImage
        src={showcase.image}
        srcLight={showcase.imageLight}
        alt={showcase.alt}
        className={cn('md:col-span-3', flip && 'md:order-1')}
      />
    </div>
  )
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-24">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="The short version: native Mac app, your own API key, and AI that only acts when you let it."
      />

      <Accordion type="single" collapsible className="mt-12 w-full">
        {FAQ.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function DownloadCta() {
  return (
    <section id="download" className="scroll-mt-20 px-6 pb-28 pt-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center">
        <div className="absolute left-1/2 top-0 z-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[100px]" />
        <div className="relative">
          <AppIcon className="mx-auto size-20" />
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring Kommando to your Mac.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Download the native app and meet your terminal’s new co-pilot.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-base font-medium"
            >
              <a href={DOWNLOAD_URL} data-track="download" data-location="cta">
                <AppleLogo className="size-5" />
                Download for macOS
              </a>
            </Button>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Free · macOS 26+ · Apple silicon
          </p>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>
    </div>
  )
}
