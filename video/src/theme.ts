/**
 * Design tokens lifted from the real Kommando app + marketing site.
 * Colors are hex/rgba (not oklch) so they render identically in the
 * Remotion Chrome renderer without color-space surprises.
 *
 * Two palettes — dark (default) and light — are selected at module-eval time
 * from the `theme` input prop (`--props='{"theme":"light"}'`). Because the
 * exported `colors` object is resolved once here, every consumer (including
 * module-scope tables like the file-tree icon map) gets the right palette with
 * no further changes.
 */

import { getInputProps } from 'remotion';

export const FPS = 30;

const dark = {
  // Brand cursor accent (icon gradient #0088ff). Site uses a slightly
  // desaturated blue in dark mode; this is the punchy version for video.
  brand: '#0a84ff',
  brandSoft: '#4aa3ff',
  brandGlow: 'rgba(10, 132, 255, 0.45)',
  brandGlowSoft: 'rgba(10, 132, 255, 0.18)',

  // Window / surfaces (translucent dark, blue-black).
  windowBg: 'rgba(22, 24, 30, 0.72)',
  windowSolid: '#16181e',
  titleBar: 'rgba(30, 33, 41, 0.6)',
  sidebarBg: 'rgba(18, 20, 26, 0.66)',
  divider: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.09)',
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceStrong: 'rgba(255, 255, 255, 0.08)',

  // Elevated, near-opaque panels (settings modal, floating app windows) and the
  // scrim that dims the backdrop behind a modal.
  panel: 'rgba(28, 30, 38, 0.97)',
  scrim: 'rgba(8, 9, 12, 0.5)',

  // The "desktop" the window floats on (video only).
  desktopTop: '#1b2436',
  desktopMid: '#11131a',
  desktopBottom: '#0c0d12',
  gridLine: 'rgba(255, 255, 255, 0.035)',

  // Text.
  fg: '#e7e9ee',
  fgDim: '#aab0bd',
  muted: '#7d8595',
  faint: '#5c6370',

  // Traffic lights.
  tlRed: '#ff5f57',
  tlYellow: '#febc2e',
  tlGreen: '#28c840',

  // Terminal prompt.
  promptPath: '#56c7b6', // teal path
  promptChevron: '#8fd06a', // green chevron
  branch: '#8b93a3',
  dirtyDot: '#e6a23c',
  cleanDot: '#5fd38d',

  // Syntax / output palette (OneDark-ish, matches screenshots).
  dir: '#5aa7ff',
  green: '#98c379',
  yellow: '#e5c07b',
  red: '#e06c75',
  cyan: '#56b6c2',
  purple: '#c678dd',
  treeLine: '#5b6472',

  // Status.
  checkGreen: '#46c771',

  // External-agent accent (a different AI app talking to Kommando over MCP).
  violet: '#a78bfa',
  violetDeep: '#7c5cf6',
  violetGlow: 'rgba(124, 92, 246, 0.45)',
  violetSurface: 'rgba(124, 92, 246, 0.14)',
};

type Palette = typeof dark;

const light: Palette = {
  // Brand accent stays the same blue; glows are softened for a light surface.
  brand: '#0a84ff',
  brandSoft: '#2f7fe6',
  brandGlow: 'rgba(10, 132, 255, 0.28)',
  brandGlowSoft: 'rgba(10, 132, 255, 0.12)',

  // Window / surfaces (translucent near-white).
  windowBg: 'rgba(251, 251, 253, 0.82)',
  windowSolid: '#f5f6f8',
  titleBar: 'rgba(244, 245, 248, 0.66)',
  sidebarBg: 'rgba(240, 242, 246, 0.82)',
  divider: 'rgba(0, 0, 0, 0.08)',
  border: 'rgba(0, 0, 0, 0.1)',
  surface: 'rgba(0, 0, 0, 0.035)',
  surfaceStrong: 'rgba(0, 0, 0, 0.06)',

  // Elevated near-opaque panels + modal scrim.
  panel: 'rgba(252, 252, 253, 0.98)',
  scrim: 'rgba(17, 19, 24, 0.28)',

  // Light desktop (video only): soft blue-grey, faint dark grid.
  desktopTop: '#eef1f7',
  desktopMid: '#e7ebf2',
  desktopBottom: '#dfe4ee',
  gridLine: 'rgba(0, 0, 0, 0.04)',

  // Text.
  fg: '#1d2026',
  fgDim: '#495162',
  muted: '#6b7280',
  faint: '#9aa1ad',

  // Traffic lights (OS colors — unchanged, read well on light too).
  tlRed: '#ff5f57',
  tlYellow: '#febc2e',
  tlGreen: '#28c840',

  // Terminal prompt (darker for contrast on a light background).
  promptPath: '#0d8f8f',
  promptChevron: '#2f9e44',
  branch: '#6b7280',
  dirtyDot: '#c2820a',
  cleanDot: '#2f9e44',

  // Syntax / output palette (One Light / GitHub-light-ish).
  dir: '#2f6df6',
  green: '#2f8f3e',
  yellow: '#b3791f',
  red: '#d23c43',
  cyan: '#0e8aa8',
  purple: '#8a4fd6',
  treeLine: '#c6ccd6',

  // Status.
  checkGreen: '#2f9e44',

  // External-agent accent.
  violet: '#7c3aed',
  violetDeep: '#6d28d9',
  violetGlow: 'rgba(124, 92, 246, 0.3)',
  violetSurface: 'rgba(124, 92, 246, 0.1)',
};

function resolveTheme(): 'light' | 'dark' {
  try {
    const props = getInputProps() as { theme?: string };
    return props && props.theme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export const themeName = resolveTheme();
export const colors: Palette = themeName === 'light' ? light : dark;

export const fonts = {
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

export const radius = {
  window: 16,
  card: 10,
  pill: 999,
};
