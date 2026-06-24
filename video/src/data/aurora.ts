/**
 * The "Aurora" custom theme used in the Theme Studio scene/shots — a northern-lights
 * palette: a deep night-sky navy background, cool foreground, an aurora-green cursor,
 * and ANSI hues pulled from the lights themselves (green, teal, violet, sky-blue, a
 * rare pink-red). Mirrors the app's CustomPalette shape: background/foreground/cursor
 * plus 16 ANSI slots (0–7 normal, 8–15 bright), all `#RRGGBB`.
 */
export type Palette16 = {
  background: string
  foreground: string
  cursor: string
  ansi: string[] // 16 entries
}

export const AURORA_DARK: Palette16 = {
  background: '#0E1726',
  foreground: '#DCE6F2',
  cursor: '#5BE6B8',
  ansi: [
    '#16223A', // 0 black
    '#FF6E8A', // 1 red (rare pink-red aurora)
    '#54E0A6', // 2 green (signature aurora green)
    '#D9E27B', // 3 yellow (yellow-green fringe)
    '#6AA8FF', // 4 blue (sky)
    '#C9A2FF', // 5 magenta (violet curtain)
    '#5FE3DA', // 6 cyan (teal)
    '#C3D0E0', // 7 white
    '#3B557A', // 8 bright black
    '#FF92A8', // 9 bright red
    '#7CF3C2', // 10 bright green
    '#ECF4A4', // 11 bright yellow
    '#9AC6FF', // 12 bright blue
    '#DDBFFF', // 13 bright magenta
    '#8BF6EE', // 14 bright cyan
    '#F2F7FC', // 15 bright white
  ],
}

export const AURORA_LIGHT: Palette16 = {
  background: '#F4F7FB',
  foreground: '#243044',
  cursor: '#12A37E',
  ansi: [
    '#243044', // 0
    '#D63B68', // 1
    '#1AA06E', // 2
    '#8A7A12', // 3 (deep olive so yellow stays legible on light)
    '#2E6FE0', // 4
    '#8A55D6', // 5
    '#0E97A0', // 6
    '#8593A6', // 7
    '#5A6B82', // 8
    '#E85C82', // 9
    '#1EB87E', // 10
    '#A89220', // 11
    '#5588EA', // 12
    '#A877E6', // 13
    '#16AEBA', // 14
    '#33415A', // 15
  ],
}

/**
 * The neutral starting palette the Theme Studio scene begins from (SwiftTerm's
 * shipped default, same seed the real app uses) — so the scene can animate the
 * "user" recoloring it into Aurora and the preview transforms live.
 */
export const SEED_DARK: Palette16 = {
  background: '#282935',
  foreground: '#E5E9F0',
  cursor: '#89B4FA',
  ansi: [
    '#000000', '#C23621', '#25BC24', '#ADAD27',
    '#492EE1', '#D338D3', '#33BBC8', '#CBCCCD',
    '#818383', '#FC391F', '#31E722', '#EAEC23',
    '#5833FF', '#F935F8', '#14F0F0', '#E9EBEB',
  ],
}

const hx = (s: string) => parseInt(s, 16)

/** Linear-interpolate two `#RRGGBB` colors. t=0 → a, t=1 → b. */
export const lerpHex = (a: string, b: string, t: number): string => {
  const ca = a.replace('#', '')
  const cb = b.replace('#', '')
  const k = Math.max(0, Math.min(1, t))
  const mix = (i: number) => {
    const va = hx(ca.slice(i, i + 2))
    const vb = hx(cb.slice(i, i + 2))
    return Math.round(va + (vb - va) * k)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${mix(0)}${mix(2)}${mix(4)}`
}

/** Interpolate every slot of two palettes by a single progress value. */
export const lerpPalette = (a: Palette16, b: Palette16, t: number): Palette16 => ({
  background: lerpHex(a.background, b.background, t),
  foreground: lerpHex(a.foreground, b.foreground, t),
  cursor: lerpHex(a.cursor, b.cursor, t),
  ansi: a.ansi.map((c, i) => lerpHex(c, b.ansi[i] ?? c, t)),
})
