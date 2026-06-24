import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { Cursor, ClickRipple } from '../components/Cursor';
import { ThemeStudio, TS_WELLS, center } from '../components/ThemeStudio';
import {
  AURORA_DARK,
  AURORA_LIGHT,
  SEED_DARK,
  lerpHex,
  type Palette16,
} from '../data/aurora';

// Choreography (scene-local frames).
const NAME_START = 12;
const NAME_END = 40;
const LIGHT_CLICK = 156;
const LIGHT_END = 172;

// Each group of palette slots recolors over 14 frames once the cursor reaches its
// well, so the preview transforms from the seed palette into Aurora in stages.
type Slot = 'background' | 'foreground' | 'cursor' | number;
const GROUPS: Array<{ start: number; slots: Slot[] }> = [
  { start: 44, slots: ['background', 'foreground', 0, 7, 8, 15] },
  { start: 66, slots: ['cursor'] },
  { start: 88, slots: [2, 6, 4, 10, 14, 12] },
  { start: 110, slots: [1, 3, 5, 9, 11, 13] },
];

const slotStart = (slot: Slot): number => {
  for (const g of GROUPS) {
    if (g.slots.includes(slot)) {
      return g.start;
    }
  }
  return 0;
};

const ramp = (frame: number, start: number) =>
  interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const buildPalette = (frame: number): Palette16 => {
  const t = (slot: Slot) => ramp(frame, slotStart(slot));
  return {
    background: lerpHex(SEED_DARK.background, AURORA_DARK.background, t('background')),
    foreground: lerpHex(SEED_DARK.foreground, AURORA_DARK.foreground, t('foreground')),
    cursor: lerpHex(SEED_DARK.cursor, AURORA_DARK.cursor, t('cursor')),
    ansi: SEED_DARK.ansi.map((c, i) => lerpHex(c, AURORA_DARK.ansi[i], t(i))),
  };
};

const typed = (text: string, frame: number, start: number, end: number) => {
  if (frame < start) {
    return '';
  }
  const p = interpolate(frame, [start, end], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return text.slice(0, Math.round(p));
};

const WP = [
  { t: 6, x: 1480, y: 740 },
  { t: 20, ...center('name') },
  { t: 46, ...center('background') },
  { t: 68, ...center('cursor') },
  { t: 90, ...center('ansiGreen') },
  { t: 112, ...center('ansiMagenta') },
  { t: LIGHT_CLICK - 4, x: 1700, y: 163 },
  { t: LIGHT_CLICK + 14, x: 1660, y: 163 },
];

const cursorPos = (frame: number) => {
  if (frame <= WP[0].t) {
    return { x: WP[0].x, y: WP[0].y };
  }
  for (let i = 1; i < WP.length; i++) {
    if (frame <= WP[i].t) {
      const a = WP[i - 1];
      const b = WP[i];
      const e = {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: 'clamp' as const,
        extrapolateRight: 'clamp' as const,
      };
      return {
        x: interpolate(frame, [a.t, b.t], [a.x, b.x], e),
        y: interpolate(frame, [a.t, b.t], [a.y, b.y], e),
      };
    }
  }
  const last = WP[WP.length - 1];
  return { x: last.x, y: last.y };
};

export const SceneThemeStudio: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();

  // Base build (seed -> Aurora dark), then flip to the light variant at the end.
  const base = buildPalette(frame);
  const lightT = interpolate(frame, [LIGHT_CLICK + 2, LIGHT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const palette: Palette16 =
    lightT > 0
      ? {
          background: lerpHex(base.background, AURORA_LIGHT.background, lightT),
          foreground: lerpHex(base.foreground, AURORA_LIGHT.foreground, lightT),
          cursor: lerpHex(base.cursor, AURORA_LIGHT.cursor, lightT),
          ansi: base.ansi.map((c, i) => lerpHex(c, AURORA_LIGHT.ansi[i], lightT)),
        }
      : base;

  const editingLight = frame >= LIGHT_CLICK;

  let highlight: keyof typeof TS_WELLS | null = null;
  if (frame >= NAME_START && frame < 42) {
    highlight = 'name';
  } else if (frame >= 42 && frame < 64) {
    highlight = 'background';
  } else if (frame >= 64 && frame < 86) {
    highlight = 'cursor';
  } else if (frame >= 86 && frame < 108) {
    highlight = 'ansiGreen';
  } else if (frame >= 108 && frame < 130) {
    highlight = 'ansiMagenta';
  }

  const name = frame < NAME_START ? '' : typed('Aurora', frame, NAME_START, NAME_END);
  const nameCursor = frame >= NAME_START && frame < NAME_END + 6;

  const pos = cursorPos(frame);
  const press = [18, 46, 68, 90, 112, LIGHT_CLICK].some((c) => Math.abs(frame - c) < 4);

  const bg = center('background');
  const cur = center('cursor');
  const grn = center('ansiGreen');
  const mag = center('ansiMagenta');
  const nm = center('name');

  return (
    <div style={{ position: 'relative', width, height }}>
      <ThemeStudio
        width={width}
        height={height}
        palette={palette}
        name={name || 'New Theme'}
        nameCursor={nameCursor}
        editingLight={editingLight}
        highlight={highlight}
      />

      <ClickRipple x={nm.x} y={nm.y} clickFrame={18} />
      <ClickRipple x={bg.x} y={bg.y} clickFrame={46} />
      <ClickRipple x={cur.x} y={cur.y} clickFrame={68} />
      <ClickRipple x={grn.x} y={grn.y} clickFrame={90} />
      <ClickRipple x={mag.x} y={mag.y} clickFrame={112} />
      <ClickRipple x={1700} y={163} clickFrame={LIGHT_CLICK} />

      <Cursor x={pos.x} y={pos.y} press={press} />
    </div>
  );
};
