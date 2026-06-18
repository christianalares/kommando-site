import type { CSSProperties, ReactNode } from 'react'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * Ambient background: faint columns of realistic terminal sessions drifting
 * slowly behind the page. One fixed layer for the whole page — prominent behind
 * the hero, easing to a faint presence as you scroll, with a gentle parallax so
 * it drifts at a different speed than the foreground. Purely decorative, masked
 * top/bottom so headlines stay legible, and freezes under
 * `prefers-reduced-motion`.
 */

type Line = { text: string; tone?: 'prompt' | 'accent' | 'dim' }

const SESSIONS: Array<Array<Line>> = [
  [
    { text: '$ kommando --version', tone: 'prompt' },
    { text: 'kommando 1.4.0 · arm64 · macOS 26.0', tone: 'dim' },
    { text: '$ pnpm build', tone: 'prompt' },
    { text: 'vite v6.0.0 building for production…', tone: 'dim' },
    { text: '✓ 142 modules transformed' },
    { text: 'dist/index.js  636.93 kB │ gzip: 134.18 kB', tone: 'dim' },
    { text: '✓ built in 376ms', tone: 'accent' },
    { text: '$ pnpm test', tone: 'prompt' },
    { text: 'PASS  src/auth/session.test.ts' },
    { text: 'PASS  src/lib/parse.test.ts' },
    { text: 'Tests  18 passed (18)', tone: 'accent' },
  ],
  [
    { text: '~ ai › why is the dev server crashing?', tone: 'accent' },
    { text: 'reading pane output…', tone: 'dim' },
    { text: '→ port 3000 in use (PID 4821)', tone: 'dim' },
    { text: '→ inserted: kill -9 4821 && pnpm dev', tone: 'accent' },
    { text: '$ kill -9 4821 && pnpm dev', tone: 'prompt' },
    { text: 'VITE v6.0.0  ready in 412 ms' },
    { text: '➜  Local:  http://localhost:3000/', tone: 'dim' },
    { text: '$ mcp: cursor connected', tone: 'prompt' },
    { text: 'agent → read_output(pane 2)', tone: 'dim' },
    { text: 'agent → run("git log --oneline -5")', tone: 'dim' },
  ],
  [
    { text: '$ git status', tone: 'prompt' },
    { text: 'On branch main' },
    { text: "Your branch is up to date with 'origin/main'." },
    { text: 'nothing to commit, working tree clean', tone: 'dim' },
    { text: '$ git log --oneline -3', tone: 'prompt' },
    { text: 'a1f3c2d feat: built-in MCP server' },
    { text: '9e0b7a1 feat: drag panes between tabs' },
    { text: '3c4d8f2 fix: clickable path detection' },
    { text: '$ git push', tone: 'prompt' },
    { text: '   9e0b7a1..a1f3c2d  main -> main', tone: 'accent' },
  ],
  [
    { text: '$ uname -mrs', tone: 'prompt' },
    { text: 'Darwin 26.0.0 arm64', tone: 'dim' },
    { text: '$ ls -la ~/dev', tone: 'prompt' },
    { text: 'drwxr-xr-x  12 you  staff   384 src' },
    { text: '-rw-r--r--   1 you  staff  1.2K README.md' },
    { text: "> const r = await fetch('/api')", tone: 'accent' },
    { text: '> (await r.json()).users.length', tone: 'accent' },
    { text: '42', tone: 'dim' },
    { text: '$ curl -s localhost:3000/health', tone: 'prompt' },
    { text: '{"status":"ok","uptime":1284}', tone: 'dim' },
  ],
]

const COLUMNS = [
  { session: 0, duration: 38, dir: 'up' as const },
  { session: 1, duration: 52, dir: 'up' as const },
  { session: 2, duration: 44, dir: 'up' as const },
  { session: 3, duration: 58, dir: 'up' as const },
  { session: 1, duration: 48, dir: 'up' as const },
  { session: 2, duration: 54, dir: 'up' as const },
]

function toneClass(tone?: Line['tone']) {
  if (tone === 'prompt') {
    return 'text-brand'
  }
  if (tone === 'accent') {
    return 'text-brand/80'
  }
  if (tone === 'dim') {
    return 'text-foreground/55'
  }
  return 'text-foreground/85'
}

// Deterministic pseudo-random in [0, 1) so SSR/client agree and the two stacked
// copies of a column stay seam-aligned, while lanes still feel uneven.
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// Per-line timing: each line gets its own typing speed and a randomized start
// phase, so columns add/remove text out of sync rather than in lockstep.
function lineStyles(col: number, count: number): Array<CSSProperties> {
  return Array.from({ length: count }, (_, i) => {
    const duration = 3.6 + rand(col * 7.3 + i * 2.17) * 4.2
    const delay = -(rand(col * 3.11 + i * 5.43) * duration * 2)
    return {
      animationDuration: `${duration.toFixed(2)}s`,
      animationDelay: `${delay.toFixed(2)}s`,
    }
  })
}

// How many times each session repeats within one half of a column. The track
// stacks two identical halves and scrolls -50%, so a half must be at least as
// tall as the viewport (plus the parallax travel) to avoid empty gaps.
const REPEAT = 6

// Softly frames each viewport (fades top + bottom) so the effect reads as a
// band behind the content rather than running edge to edge.
const MASK =
  'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)'

// Renders one half of a column: the session repeated `repeat` times. Both halves
// share the same `styles`, so they stay pixel-identical and the loop is seamless.
function half(
  session: number,
  styles: Array<CSSProperties>,
  copy: number,
  repeat: number,
) {
  const lines = SESSIONS[session]
  const out: Array<ReactNode> = []
  for (let r = 0; r < repeat; r++) {
    lines.forEach((line, i) => {
      const idx = r * lines.length + i
      out.push(
        <div
          key={`${copy}-${idx}`}
          className={cn('drift-line whitespace-pre', toneClass(line.tone))}
          style={styles[idx]}
        >
          {line.text}
        </div>,
      )
    })
  }
  return out
}

export function CommandDrift() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  // Prominent behind the hero, easing to a faint presence once the hero has
  // scrolled away — so a single layer reads strong up top and subtle below.
  const opacity = useTransform(scrollY, [0, 600], [0.1, 0.06])
  // Gentle parallax: the band drifts up a touch slower than the page scrolls.
  const y = useTransform(scrollY, [0, 1400], [0, -600])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 flex justify-center gap-10 overflow-hidden px-6 will-change-transform"
      style={{
        opacity: reduce ? 0.08 : opacity,
        y: reduce ? 0 : y,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      {COLUMNS.map((col, i) => {
        const styles = lineStyles(i, SESSIONS[col.session].length * REPEAT)
        return (
          <div key={i} className="w-64 shrink-0">
            <div
              className="drift-track flex flex-col space-y-1.5 font-mono text-[11px] leading-relaxed"
              data-dir={col.dir}
              style={{
                animationDuration: `${col.duration}s`,
                animationDelay: `-${(col.duration / COLUMNS.length) * i}s`,
              }}
            >
              {half(col.session, styles, 0, REPEAT)}
              {half(col.session, styles, 1, REPEAT)}
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
