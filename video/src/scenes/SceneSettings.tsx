import {
  Check,
  Command as CommandIcon,
  Keyboard,
  Paintbrush,
  Plus,
  Sparkles,
  SquareTerminal,
  Trash2,
  X,
} from 'lucide-react';
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { Cursor, ClickRipple } from '../components/Cursor';
import { KeystrokeOverlay } from '../components/KeystrokeOverlay';
import { BlockCursor } from '../components/BlockCursor';
import { MONO_LH, MONO_SIZE, PromptLine } from '../components/terminal/parts';
import { LS_ENTRIES, LsRow } from '../components/terminal/ls';
import { Sans } from '../components/sidebar/parts';
import { colors, fonts, radius } from '../theme';

const MODAL_W = 760;
const MODAL_H = 470;

// Choreography (scene-local frames).
const ADD_CLICK = 32;
const NAME_START = 50;
const CMD_START = 68;
const SHORTCUT_CLICK = 96;
const SHORTCUT_ASSIGNED = 102;
const CHECK_CLICK = 124;
const CLOSE_CLICK = 146; // cursor clicks the close dot, panel dismisses
const CLEAR_PRESS = 166; // ⌘K pressed
const CLEAR = CLEAR_PRESS + 9; // terminal clears

// Cursor waypoints in modal-local coordinates.
const WP = [
  { t: 12, x: 690, y: 452 },
  { t: 30, x: 108, y: 413 }, // Add Command button
  { t: 48, x: 144, y: 282 }, // new name field
  { t: 66, x: 441, y: 282 }, // new command field
  { t: 94, x: 560, y: 332 }, // shortcut field
  { t: 122, x: 37, y: 332 }, // run-immediately checkbox
  { t: 144, x: 24, y: 23 }, // close (red traffic light)
];

const cursorPos = (frame: number) => {
  if (frame <= WP[0].t) {
    return { x: WP[0].x, y: WP[0].y };
  }
  for (let i = 1; i < WP.length; i++) {
    if (frame <= WP[i].t) {
      const a = WP[i - 1];
      const b = WP[i];
      const e = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
      return {
        x: interpolate(frame, [a.t, b.t], [a.x, b.x], e),
        y: interpolate(frame, [a.t, b.t], [a.y, b.y], e),
      };
    }
  }
  const last = WP[WP.length - 1];
  return { x: last.x, y: last.y };
};

const typed = (text: string, frame: number, start: number, cps = 26) => {
  if (frame < start) {
    return '';
  }
  return text.slice(0, Math.floor(((frame - start) / 30) * cps));
};

const SettingsTab: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 10,
      backgroundColor: active ? colors.brand : 'transparent',
      color: active ? '#fff' : colors.muted,
    }}
  >
    {icon}
    <Sans style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</Sans>
  </div>
);

const Field: React.FC<{
  value: string;
  mono?: boolean;
  cursor?: boolean;
  placeholder?: string;
  left: number;
  top: number;
  width: number;
}> = ({ value, mono, cursor, placeholder, left, top, width }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      borderRadius: 8,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      fontFamily: mono ? fonts.mono : fonts.sans,
      fontSize: 14.5,
    }}
  >
    <span style={{ color: value ? colors.fg : colors.muted }}>
      {value || placeholder || ''}
    </span>
    {cursor ? (
      <BlockCursor width={2} height={17} color={colors.brand} blink={false} />
    ) : null}
  </div>
);

const Checkbox: React.FC<{ checked: boolean; left: number; top: number }> = ({
  checked,
  left,
  top,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 18,
      height: 18,
      borderRadius: 5,
      backgroundColor: checked ? colors.brand : 'transparent',
      border: `1.5px solid ${checked ? colors.brand : colors.muted}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {checked ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
  </div>
);

const ShortcutPill: React.FC<{
  keys?: string;
  recording?: boolean;
  left: number;
  top: number;
}> = ({ keys, recording, left, top }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 104,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: colors.surfaceStrong,
      border: `1.5px solid ${recording ? colors.brand : colors.border}`,
      fontFamily: keys ? fonts.mono : fonts.sans,
      fontSize: keys ? 14 : 12.5,
      color: keys ? colors.fgDim : colors.muted,
    }}
  >
    {keys || (recording ? 'Recording…' : 'Set key')}
  </div>
);

export const SceneSettings: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 18, mass: 0.7 },
  });

  // Panel dismissal after the command is configured.
  const modalOut = interpolate(frame, [CLOSE_CLICK, CLOSE_CLICK + 12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const closeScale = interpolate(
    frame,
    [CLOSE_CLICK, CLOSE_CLICK + 12],
    [1, 0.95],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const modalOpacity = enter * modalOut;
  const scale = (0.92 + enter * 0.08) * closeScale;

  // Terminal clear (⌘K) once the panel is gone.
  const cleared = frame >= CLEAR;
  const oldOpacity = interpolate(frame, [CLEAR - 1, CLEAR + 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const freshOpacity = interpolate(frame, [CLEAR, CLEAR + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clearOverlay = interpolate(
    frame,
    [CLEAR_PRESS - 6, CLEAR_PRESS, CLEAR + 6, CLEAR + 16],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const clearPressed = frame >= CLEAR_PRESS && frame < CLEAR + 4;

  const added = frame >= ADD_CLICK + 2;
  const nameVal = typed('Clear', frame, NAME_START);
  const cmdVal = typed('clear', frame, CMD_START);
  const recording = frame >= SHORTCUT_CLICK && frame < SHORTCUT_ASSIGNED + 10;
  const assigned = frame >= SHORTCUT_ASSIGNED;
  const checked = frame >= CHECK_CLICK + 1;

  const nameCursor = frame >= NAME_START && frame < CMD_START;
  const cmdCursor = frame >= CMD_START && frame < SHORTCUT_CLICK;

  const pos = cursorPos(frame);
  const pressing =
    Math.abs(frame - ADD_CLICK) < 4 ||
    Math.abs(frame - SHORTCUT_CLICK) < 4 ||
    Math.abs(frame - CHECK_CLICK) < 4 ||
    Math.abs(frame - CLOSE_CLICK) < 4;

  const overlayProgress = interpolate(
    frame,
    [SHORTCUT_CLICK - 2, SHORTCUT_CLICK + 4, SHORTCUT_ASSIGNED + 6, SHORTCUT_ASSIGNED + 16],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <KommandoWindow
      width={width}
      height={height}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
    >
      {/* Backdrop terminal (filled, before clear) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '22px 26px',
          opacity: oldOpacity,
        }}
      >
        <PromptLine command="ls -lSh" dirty={false} />
        <div style={{ marginTop: 4 }}>
          {LS_ENTRIES.map((entry, i) => (
            <div key={i} style={{ height: MONO_SIZE * MONO_LH }}>
              <LsRow entry={entry} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 6 }}>
          <PromptLine command="" cursor={!cleared} />
        </div>
      </div>

      {/* Cleared terminal (after ⌘K) */}
      {cleared ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '22px 26px',
            opacity: freshOpacity,
          }}
        >
          <PromptLine command="" cursor />
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: modalOpacity,
          backgroundColor: colors.scrim,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: MODAL_W,
            height: MODAL_H,
            opacity: modalOpacity,
            transform: `scale(${scale})`,
            borderRadius: radius.window,
            backgroundColor: colors.panel,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 40px 120px -20px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Titlebar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: `1px solid ${colors.divider}`,
            }}
          >
            <div style={{ position: 'absolute', left: 16, display: 'flex', gap: 8 }}>
              <span style={dot(colors.tlRed)} />
              <span style={dot(colors.tlYellow)} />
              <span style={dot(colors.tlGreen)} />
            </div>
            <Sans style={{ fontSize: 15, fontWeight: 600, color: colors.fg }}>
              Commands
            </Sans>
          </div>

          {/* Tabs */}
          <div
            style={{
              position: 'absolute',
              top: 58,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <SettingsTab icon={<Paintbrush size={20} />} label="Appearance" />
            <SettingsTab icon={<SquareTerminal size={20} />} label="Terminal" />
            <SettingsTab icon={<Keyboard size={20} />} label="Shortcuts" />
            <SettingsTab icon={<CommandIcon size={20} />} label="Commands" active />
            <SettingsTab icon={<Sparkles size={20} />} label="AI" />
          </div>

          {/* Existing command: List files */}
          <Field value="List files" left={28} top={140} width={232} />
          <Field value="ls" mono left={276} top={140} width={330} />
          <Trash2 size={18} color={colors.muted} style={{ position: 'absolute', left: 628, top: 152 }} />
          <Checkbox checked left={28} top={201} />
          <Sans style={{ position: 'absolute', left: 56, top: 200, fontSize: 14, color: colors.fgDim }}>
            Run immediately
          </Sans>
          <ShortcutPill keys="⌘L" left={508} top={192} />
          <X size={17} color={colors.muted} style={{ position: 'absolute', left: 628, top: 201 }} />

          {/* New command: Clear (added by the user) */}
          {added ? (
            <>
              <Field
                value={nameVal}
                cursor={nameCursor}
                placeholder="Name"
                left={28}
                top={262}
                width={232}
              />
              <Field
                value={cmdVal}
                mono
                cursor={cmdCursor}
                placeholder="Command"
                left={276}
                top={262}
                width={330}
              />
              <Trash2 size={18} color={colors.muted} style={{ position: 'absolute', left: 628, top: 274 }} />
              <Checkbox checked={checked} left={28} top={323} />
              <Sans style={{ position: 'absolute', left: 56, top: 322, fontSize: 14, color: colors.fgDim }}>
                Run immediately
              </Sans>
              <ShortcutPill
                keys={assigned ? '⌘K' : undefined}
                recording={recording}
                left={508}
                top={314}
              />
              <X size={17} color={colors.muted} style={{ position: 'absolute', left: 628, top: 323 }} />
            </>
          ) : null}

          {/* Footer: Add Command */}
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: 392,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 9,
              backgroundColor: colors.surfaceStrong,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Plus size={16} color={colors.fgDim} />
            <Sans style={{ fontSize: 14, color: colors.fg }}>Add Command</Sans>
          </div>

          {/* Cursor + click feedback (modal-local coords) */}
          <ClickRipple x={108} y={413} clickFrame={ADD_CLICK} />
          <ClickRipple x={560} y={332} clickFrame={SHORTCUT_CLICK} />
          <ClickRipple x={37} y={332} clickFrame={CHECK_CLICK} />
          <ClickRipple x={24} y={23} clickFrame={CLOSE_CLICK} />
          {frame >= 10 ? <Cursor x={pos.x} y={pos.y} press={pressing} /> : null}
        </div>
      </div>

      <KeystrokeOverlay
        progress={overlayProgress}
        pressed={frame >= SHORTCUT_CLICK && frame < SHORTCUT_ASSIGNED + 6}
      />
      <KeystrokeOverlay progress={clearOverlay} pressed={clearPressed} />
    </KommandoWindow>
  );
};

const dot = (color: string): React.CSSProperties => ({
  width: 13,
  height: 13,
  borderRadius: '50%',
  backgroundColor: color,
});
