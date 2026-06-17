import { createFileRoute } from '@tanstack/react-router'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const Route = createFileRoute('/legal')({
  component: Legal,
  head: () => ({
    meta: [
      { title: 'Legal — Kommando' },
      {
        name: 'description',
        content:
          'Privacy, terms, and contact information for Kommando, a native macOS terminal.',
      },
    ],
  }),
})

const LAST_UPDATED = 'June 17, 2026'

function Legal() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(120,160,255,0.12),transparent)]"
      />
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Privacy &amp; terms
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {LAST_UPDATED}
        </p>

        <div className="mt-12 space-y-12">
          <Section title="Privacy">
            <p>
              Kommando is a native macOS app that runs on your Mac. The app
              itself does not operate any backend server, and we do not collect,
              store, or sell your personal data. There are no accounts, no
              trackers, and no analytics baked into the terminal.
            </p>
            <p>
              Your shell sessions, command history, and terminal output stay on
              your device. They are never transmitted to us.
            </p>
          </Section>

          <Section title="AI assistant & your API key">
            <p>
              The optional AI assistant requires your own Anthropic or OpenAI
              API key. That key is stored in the macOS Keychain and is only ever
              sent directly from your Mac to the provider you selected.
            </p>
            <p>
              When you use the assistant, the relevant context — such as the
              focused pane&apos;s working directory and visible output — is sent
              to that provider so it can answer. This data is handled under your
              chosen provider&apos;s privacy policy and terms, not ours. If you
              never configure a key, no terminal data leaves your Mac.
            </p>
          </Section>

          <Section title="Terms of use">
            <p>
              Kommando is provided “as is,” without warranty of any kind, express
              or implied. To the maximum extent permitted by law, the authors are
              not liable for any damages arising from the use of the software,
              including data loss or commands executed in your terminal.
            </p>
            <p>
              You are responsible for the commands you run, including any that
              the AI assistant suggests. Review commands before executing them.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>
              When you enable the AI assistant, requests are sent to the provider
              whose key you configured:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <a
                  href="https://www.anthropic.com/legal/privacy"
                  className="text-foreground underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Anthropic Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://openai.com/policies/privacy-policy/"
                  className="text-foreground underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenAI Privacy Policy
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Questions about privacy or these terms? Reach out at{' '}
              <a
                href="mailto:hello@kommando.app"
                className="text-foreground underline-offset-4 hover:underline"
              >
                hello@kommando.app
              </a>
              .
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}
