import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { Cursor, ClickRipple } from '../components/Cursor';
import { KeystrokeOverlay } from '../components/KeystrokeOverlay';
import {
  CB_PAD_X,
  CommandBlocksTerminal,
  blockRect,
} from '../components/CommandBlocksTerminal';

// Choreography (scene-local frames).
const CLICK = 40; // cursor clicks the build block -> it selects
const COPY = 78; // ⌘C pressed
const COPIED = COPY + 4; // pill appears

// The build block's clickable point (inside its first line, left-ish).
const r0 = blockRect(0);
const TARGET_X = CB_PAD_X + 120;
const TARGET_Y = r0.top + 18;

export const SceneCommandBlocks: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();

  const cx = interpolate(frame, [8, 34], [TARGET_X + 360, TARGET_X], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = interpolate(frame, [8, 34], [TARGET_Y + 180, TARGET_Y], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const selected = frame >= CLICK ? 0 : null;
  const press = Math.abs(frame - CLICK) < 4;
  const copied = frame >= COPIED;

  // ⌘C keystroke overlay.
  const copyOverlay = interpolate(
    frame,
    [COPY - 6, COPY, COPY + 14, COPY + 24],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const copyPressed = frame >= COPY && frame < COPY + 8;

  // Cursor slips away after copying so the block + pill read clearly.
  const cursorGone = interpolate(frame, [COPY + 6, COPY + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <KommandoWindow
      width={width}
      height={height}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
    >
      <CommandBlocksTerminal selected={selected} copied={copied} />

      <ClickRipple x={TARGET_X} y={TARGET_Y} clickFrame={CLICK} />
      <div style={{ opacity: cursorGone }}>
        <Cursor x={cx} y={cy} press={press} />
      </div>

      <KeystrokeOverlay progress={copyOverlay} pressed={copyPressed} keys={['⌘', 'C']} />
    </KommandoWindow>
  );
};
