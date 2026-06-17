import { createFileRoute } from '@tanstack/react-router'
import {
  Apple,
  Braces,
  Columns2,
  Cpu,
  KeyRound,
  Sparkles,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Screenshot } from '@/components/screenshot'
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
    title: 'Native & instant',
    body: 'Built in SwiftUI for Apple silicon. Real macOS windows, vibrant chrome, and zero Electron bloat.',
  },
  {
    icon: Sparkles,
    title: 'AI in the sidebar',
    body: 'An assistant that already sees your working directory and on-screen output — ask questions in context.',
  },
  {
    icon: KeyRound,
    title: 'Bring your own key',
    body: 'Plug in your own Anthropic or OpenAI key. It is stored in the macOS Keychain and only ever talks to your provider.',
  },
  {
    icon: Columns2,
    title: 'Split panes & tabs',
    body: 'Tile terminals into a tree of panes, group them into tabs, and find across any pane instantly.',
  },
  {
    icon: SquareTerminal,
    title: 'JavaScript REPL',
    body: 'A built-in JS scratchpad with persistent bindings, console capture, and $0/$1 history of recent results.',
  },
  {
    icon: Braces,
    title: 'Inline JSON inspector',
    body: 'Kommando spots JSON in your output and lets you expand and explore it in a structured viewer.',
  },
]

type Showcase = {
  eyebrow: string
  title: string
  body: string
  points: Array<string>
  image: string
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
    image: '/img/screenshot-2.webp',
    alt: 'Kommando AI sidebar inserting and running shell commands',
  },
  {
    eyebrow: 'Panes & tabs',
    title: 'Split your workspace any way you like.',
    body: 'Tile terminals into a tree of panes and group them into tabs. Keep your server, logs, and a scratch shell side by side in a single window.',
    points: [
      'Recursive split panes, horizontal or vertical',
      'Tabs for separate sessions',
      'Find across any pane in an instant',
    ],
    image: '/img/screenshot-3.webp',
    alt: 'Kommando showing three terminals tiled into split panes',
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
    image: '/img/screenshot-4.webp',
    alt: 'Kommando settings showing custom commands with keyboard shortcuts',
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
    q: 'Which macOS version do I need?',
    a: 'Kommando targets recent macOS releases and runs natively on both Apple silicon and Intel Macs.',
  },
]

function Home() {
  return (
    <div id="top" className="relative">
      <BackgroundGlow />
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
      <div className="absolute left-1/2 top-[-12rem] size-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-[-16rem] right-[-8rem] size-[34rem] rounded-full bg-accent/5 blur-[120px]" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 80% 50% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
    </div>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-white/10 bg-white/5 px-3 py-1 text-muted-foreground"
        >
          <Sparkles className="size-3 text-accent" />
          A terminal with AI built in
        </Badge>

        <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          The terminal that
          <br className="hidden sm:block" /> thinks with you.
        </h1>

        <p className="mt-5 text-balance text-lg text-muted-foreground">
          <Wordmark withCursor={false} className="font-semibold" /> is a fast,
          native macOS terminal with a built-in AI assistant, split panes, a
          JavaScript REPL, and an inline JSON inspector.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 text-base font-medium"
          >
            <a href="#download">
              <Apple className="size-5" />
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
          Apple silicon &amp; Intel · No account required
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl">
        <Screenshot
          src="/img/screenshot-1.webp"
          alt="Kommando terminal with the AI assistant explaining a project's file structure"
          priority
        />
      </div>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24"
    >
      <SectionHeading
        eyebrow="Features"
        title="Everything you reach for, in one window"
        subtitle="Kommando keeps the speed of a native terminal and adds the tools you usually juggle across three other apps."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, body }: Feature) {
  return (
    <div className="group bg-background p-7 transition-colors hover:bg-card">
      <div className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent transition-colors group-hover:border-accent/30">
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
          <ShowcaseRow key={showcase.title} showcase={showcase} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

function ShowcaseRow({
  showcase,
  flip,
}: {
  showcase: Showcase
  flip: boolean
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <div className={flip ? 'md:order-2' : undefined}>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {showcase.eyebrow}
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {showcase.title}
        </h2>
        <p className="mt-5 text-muted-foreground">{showcase.body}</p>

        <ul className="mt-8 space-y-4">
          {showcase.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <Screenshot
        src={showcase.image}
        alt={showcase.alt}
        className={flip ? 'md:order-1' : undefined}
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
        subtitle="The short version: it’s fast, it’s native, and your keystrokes stay yours."
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
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-card px-8 py-16 text-center">
        <div className="absolute left-1/2 top-0 -z-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]" />
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
              <a href="#">
                <Apple className="size-5" />
                Download for macOS
              </a>
            </Button>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Free · Apple silicon &amp; Intel
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
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>
    </div>
  )
}
