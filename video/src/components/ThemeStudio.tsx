import { Check, Minus, Plus } from 'lucide-react';
import { colors, fonts, radius } from '../theme';
import type { Palette16 } from '../data/aurora';

/**
 * The "Theme Studio" window, themed by the app `colors` chrome but previewing an
 * arbitrary `palette` (the theme being edited). Layout coordinates are fixed so the
 * animated scene can drive a cursor + focus ring onto specific color wells. Used by
 * both the static shot and the live-editing scene.
 */

const TITLEBAR_H = 50;
const RAIL_W = 300;
const EDITOR_X = RAIL_W;
const EDITOR_PAD = 30;
const HEADER_H = 84;
const VAR_H = 58;
const BODY_TOP = TITLEBAR_H + HEADER_H + VAR_H; // 192

const WIN_COL_X = EDITOR_X + EDITOR_PAD; // window-section well x
const ANSI_NAME_X = EDITOR_X + EDITOR_PAD;
const ANSI_NORMAL_X = EDITOR_X + EDITOR_PAD + 150;
const ANSI_BRIGHT_X = ANSI_NORMAL_X + 86;

const WELL_W = 50;
const WELL_H = 30;

const WIN_BG_TOP = BODY_TOP + 52;
const WIN_FG_TOP = WIN_BG_TOP + 50;
const WIN_CURSOR_TOP = WIN_FG_TOP + 50;
const ANSI_ROW0_TOP = BODY_TOP + 256;
const ANSI_ROW_H = 44;

/** Window-local coordinates of targetable controls (for the scene's cursor/ring). */
export const TS_WELLS = {
  name: { left: EDITOR_X + 30, top: TITLEBAR_H + 22, w: 300, h: 40 },
  background: { left: WIN_COL_X, top: WIN_BG_TOP, w: WELL_W, h: WELL_H },
  cursor: { left: WIN_COL_X, top: WIN_CURSOR_TOP, w: WELL_W, h: WELL_H },
  ansiGreen: { left: ANSI_NORMAL_X, top: ANSI_ROW0_TOP + 2 * ANSI_ROW_H, w: WELL_W, h: WELL_H },
  ansiMagenta: { left: ANSI_NORMAL_X, top: ANSI_ROW0_TOP + 5 * ANSI_ROW_H, w: WELL_W, h: WELL_H },
} as const;

export const center = (k: keyof typeof TS_WELLS) => {
  const w = TS_WELLS[k];
  return { x: w.left + w.w / 2, y: w.top + w.h / 2 };
};

const ANSI_NAMES = ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'];

const RAIL_THEMES = [
  { name: 'Aurora', sw: ['#0E1726', '#54E0A6', '#C9A2FF'] },
  { name: 'Midnight', sw: ['#11131a', '#5aa7ff', '#c678dd'] },
  { name: 'Paper', sw: ['#f6f7fa', '#2f8f3e', '#8a4fd6'] },
];

const dot = (c: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: c,
});

const Ring: React.FC<{ on?: boolean }> = ({ on }) =>
  on ? (
    <div
      style={{
        position: 'absolute',
        inset: -4,
        borderRadius: 11,
        border: `2.5px solid ${colors.brand}`,
        boxShadow: `0 0 16px ${colors.brandGlow}`,
      }}
    />
  ) : null;

const Well: React.FC<{ color: string; ring?: boolean }> = ({ color, ring }) => (
  <div style={{ position: 'relative', width: WELL_W, height: WELL_H }}>
    <div
      style={{
        width: WELL_W,
        height: WELL_H,
        borderRadius: 7,
        backgroundColor: color,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)',
      }}
    />
    <Ring on={ring} />
  </div>
);

const Sans: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => <span style={{ fontFamily: fonts.sans, color: colors.fg, ...style }}>{children}</span>;

const SectionLabel: React.FC<{ children: React.ReactNode; top: number }> = ({
  children,
  top,
}) => (
  <Sans
    style={{
      position: 'absolute',
      left: EDITOR_X + EDITOR_PAD,
      top,
      fontSize: 12.5,
      fontWeight: 700,
      letterSpacing: '0.08em',
      color: colors.muted,
    }}
  >
    {children}
  </Sans>
);

const HexField: React.FC<{ value: string; left: number; top: number }> = ({
  value,
  left,
  top,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 124,
      height: 34,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      borderRadius: 8,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      fontFamily: fonts.mono,
      fontSize: 15,
      color: colors.fgDim,
    }}
  >
    {value.toUpperCase()}
  </div>
);

export const ThemeStudio: React.FC<{
  width: number;
  height: number;
  palette: Palette16;
  name: string;
  nameCursor?: boolean;
  editingLight?: boolean;
  adaptive?: boolean;
  highlight?: keyof typeof TS_WELLS | null;
  style?: React.CSSProperties;
}> = ({
  width,
  height,
  palette,
  name,
  nameCursor = false,
  editingLight = false,
  adaptive = true,
  highlight = null,
  style,
}) => {
  const ansi = (i: number) => palette.ansi[i] ?? '#888';

  const winRows: Array<[string, string, number]> = [
    ['Background', palette.background, WIN_BG_TOP],
    ['Foreground', palette.foreground, WIN_FG_TOP],
    ['Cursor', palette.cursor, WIN_CURSOR_TOP],
  ];

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius.window,
        overflow: 'hidden',
        backgroundColor: colors.windowSolid,
        border: `1px solid ${colors.border}`,
        boxShadow:
          '0 40px 120px -20px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        position: 'relative',
        ...style,
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          height: TITLEBAR_H,
          borderBottom: `1px solid ${colors.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: colors.titleBar,
        }}
      >
        <div style={{ position: 'absolute', left: 20, display: 'flex', gap: 8 }}>
          <span style={dot(colors.tlRed)} />
          <span style={dot(colors.tlYellow)} />
          <span style={dot(colors.tlGreen)} />
        </div>
        <Sans style={{ fontSize: 15.5, fontWeight: 600, color: colors.fg }}>Theme Studio</Sans>
      </div>

      {/* Rail */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: TITLEBAR_H,
          bottom: 0,
          width: RAIL_W,
          borderRight: `1px solid ${colors.divider}`,
          backgroundColor: colors.sidebarBg,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, padding: 10 }}>
          {RAIL_THEMES.map((t) => {
            const active = t.name === name || (t.name === 'Aurora' && name.startsWith('Aur'));
            return (
              <div
                key={t.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 46,
                  padding: '0 12px',
                  borderRadius: 9,
                  backgroundColor: active ? colors.surfaceStrong : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 24,
                    borderRadius: 5,
                    backgroundColor: t.sw[0],
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <span style={dot(t.sw[1])} />
                  <span style={dot(t.sw[2])} />
                </div>
                <Sans style={{ fontSize: 15, fontWeight: active ? 600 : 400, flex: 1 }}>
                  {t.name}
                </Sans>
                {active ? (
                  <Check size={16} color={colors.brand} strokeWidth={2.6} />
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: 42,
            borderTop: `1px solid ${colors.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 16px',
          }}
        >
          <Plus size={16} color={colors.muted} />
          <Minus size={16} color={colors.muted} />
        </div>
      </div>

      {/* Header: name + actions */}
      <div
        style={{
          position: 'absolute',
          left: TS_WELLS.name.left,
          top: TS_WELLS.name.top,
          width: TS_WELLS.name.w,
          height: TS_WELLS.name.h,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderRadius: 9,
          backgroundColor: colors.surface,
          border: `1px solid ${highlight === 'name' ? colors.brand : colors.border}`,
        }}
      >
        <Sans style={{ fontSize: 18, fontWeight: 600 }}>{name}</Sans>
        {nameCursor ? (
          <span
            style={{
              width: 2,
              height: 20,
              marginLeft: 1,
              backgroundColor: colors.brand,
              display: 'inline-block',
            }}
          />
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 28,
          top: TITLEBAR_H + 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Sans style={{ fontSize: 14.5, color: colors.muted }}>Reset</Sans>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Check size={16} color={colors.brand} strokeWidth={2.6} />
          <Sans style={{ fontSize: 14.5, fontWeight: 600, color: colors.brand }}>Active</Sans>
        </div>
      </div>

      {/* Variant bar */}
      <div
        style={{
          position: 'absolute',
          left: RAIL_W,
          right: 0,
          top: TITLEBAR_H + HEADER_H,
          height: VAR_H,
          borderTop: `1px solid ${colors.divider}`,
          borderBottom: `1px solid ${colors.divider}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            backgroundColor: adaptive ? colors.brand : 'transparent',
            border: `1.5px solid ${adaptive ? colors.brand : colors.muted}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {adaptive ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
        </div>
        <Sans style={{ fontSize: 14.5, color: colors.fgDim }}>Adapt to light &amp; dark</Sans>
        <div style={{ flex: 1 }} />
        {adaptive ? (
          <div
            style={{
              display: 'flex',
              padding: 3,
              borderRadius: 8,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            {(['Dark', 'Light'] as const).map((seg) => {
              const on = seg === (editingLight ? 'Light' : 'Dark');
              return (
                <div
                  key={seg}
                  style={{
                    padding: '5px 18px',
                    borderRadius: 6,
                    backgroundColor: on ? colors.brand : 'transparent',
                  }}
                >
                  <Sans style={{ fontSize: 13.5, fontWeight: 600, color: on ? '#fff' : colors.muted }}>
                    {seg}
                  </Sans>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Editor */}
      <SectionLabel top={BODY_TOP + 22}>WINDOW</SectionLabel>
      {winRows.map(([label, color, top]) => {
        const key = label.toLowerCase() as keyof typeof TS_WELLS;
        const ringed = highlight === key;
        return (
          <div key={label}>
            <div style={{ position: 'absolute', left: WIN_COL_X, top }}>
              <Well color={color} ring={ringed} />
            </div>
            <Sans
              style={{
                position: 'absolute',
                left: WIN_COL_X + WELL_W + 16,
                top: top + 5,
                fontSize: 15,
                color: colors.fgDim,
              }}
            >
              {label}
            </Sans>
            <HexField value={color} left={WIN_COL_X + WELL_W + 130} top={top - 2} />
          </div>
        );
      })}

      <SectionLabel top={BODY_TOP + 226}>ANSI COLORS</SectionLabel>
      <Sans style={{ position: 'absolute', left: ANSI_NORMAL_X, top: BODY_TOP + 228, fontSize: 12.5, color: colors.muted }}>
        Normal
      </Sans>
      <Sans style={{ position: 'absolute', left: ANSI_BRIGHT_X, top: BODY_TOP + 228, fontSize: 12.5, color: colors.muted }}>
        Bright
      </Sans>
      {ANSI_NAMES.map((nm, i) => {
        const top = ANSI_ROW0_TOP + i * ANSI_ROW_H;
        const ringNormal =
          (highlight === 'ansiGreen' && i === 2) || (highlight === 'ansiMagenta' && i === 5);
        return (
          <div key={nm}>
            <Sans
              style={{
                position: 'absolute',
                left: ANSI_NAME_X,
                top: top + 5,
                fontSize: 14.5,
                color: colors.fgDim,
              }}
            >
              {nm}
            </Sans>
            <div style={{ position: 'absolute', left: ANSI_NORMAL_X, top }}>
              <Well color={ansi(i)} ring={ringNormal} />
            </div>
            <div style={{ position: 'absolute', left: ANSI_BRIGHT_X, top }}>
              <Well color={ansi(i + 8)} />
            </div>
          </div>
        );
      })}

      {/* Preview */}
      <ThemePreview
        palette={palette}
        left={EDITOR_X + 560}
        top={BODY_TOP}
        right={0}
      />
    </div>
  );
};

const ThemePreview: React.FC<{
  palette: Palette16;
  left: number;
  top: number;
  right: number;
}> = ({ palette, left, top, right }) => {
  const a = (i: number) => palette.ansi[i] ?? '#888';
  const fg = palette.foreground;
  const cur = palette.cursor;

  const seg = (parts: Array<[string, string]>, key: number) => (
    <div
      key={key}
      style={{
        fontFamily: fonts.mono,
        fontSize: 19,
        lineHeight: 1.55,
        whiteSpace: 'pre',
      }}
    >
      {parts.map(([t, c], i) => (
        <span key={i} style={{ color: c }}>
          {t}
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left,
        right,
        top,
        bottom: 0,
        borderLeft: `1px solid ${colors.divider}`,
        backgroundColor: palette.background,
        padding: 30,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {seg(
          [
            ['john', a(2)],
            ['@', fg],
            ['mac', a(2)],
            [' ~/dev/acme ', a(4)],
            ['git:(', fg],
            ['main', a(1)],
            [') ', fg],
            ['▏', cur],
          ],
          0,
        )}
        {seg(
          [
            ['src  ', a(4)],
            ['build  ', a(4)],
            ['run.sh  ', a(2)],
            ['README.md  ', fg],
            ['notes.txt', fg],
          ],
          1,
        )}
        {seg(
          [
            ['a1b2c3d', a(3)],
            [' (', fg],
            ['HEAD -> ', a(6)],
            ['main', a(2)],
            [') ', fg],
            ['Add Aurora theme', fg],
          ],
          2,
        )}
        {seg(
          [
            ['const ', a(5)],
            ['answer ', fg],
            ['= ', a(6)],
            ['"42"', a(3)],
            [';', fg],
          ],
          3,
        )}
        {seg([['git push --set-upstream origin main', a(8)]], 4)}
      </div>

      <div style={{ marginTop: 26 }}>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: fg,
            opacity: 0.6,
          }}
        >
          ANSI 0–15
        </span>
        <div
          style={{
            marginTop: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 8,
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 30,
                borderRadius: 6,
                backgroundColor: a(i),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18)',
              }}
            >
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: i === 0 || (i >= 1 && i <= 6) ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
                }}
              >
                {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
