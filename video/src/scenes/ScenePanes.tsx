import {
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { PromptLine } from '../components/terminal/parts';
import { colors } from '../theme';

type Pos = { left: number; top: number };
const TL: Pos = { left: 0, top: 0 };
const TR: Pos = { left: 50, top: 0 };
const BL: Pos = { left: 0, top: 50 };
const BR: Pos = { left: 50, top: 50 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Cell: React.FC<{
  pos: Pos;
  z?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ pos, z = 1, children, style }) => (
  <div
    style={{
      position: 'absolute',
      left: `${pos.left}%`,
      top: `${pos.top}%`,
      width: '50%',
      height: '50%',
      zIndex: z,
      ...style,
    }}
  >
    {children}
  </div>
);

const PanePrompt: React.FC<{ path: string; active?: boolean }> = ({
  path,
  active = false,
}) => (
  <div style={{ padding: '18px 22px', opacity: active ? 1 : 0.45 }}>
    <PromptLine path={path} command="" cursor={active} showBranch={false} />
  </div>
);

const SWAP_START = 48;
const SWAP_END = 74;

export const ScenePanes: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();

  const swap = interpolate(frame, [SWAP_START, SWAP_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  // Pane A: top-right -> bottom-left (the grabbed pane, solid highlight).
  const aPos: Pos = {
    left: lerp(TR.left, BL.left, swap),
    top: lerp(TR.top, BL.top, swap),
  };
  // Pane B: bottom-left -> top-right.
  const bPos: Pos = {
    left: lerp(BL.left, TR.left, swap),
    top: lerp(BL.top, TR.top, swap),
  };

  const highlight = interpolate(
    frame,
    [22, 32, SWAP_END - 2, SWAP_END + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  // The dashed destination ghost fades out once the swap starts moving.
  const ghost = interpolate(frame, [22, 32, SWAP_START, SWAP_START + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <KommandoWindow
      width={width}
      height={height}
      tabs={
        <>
          <Tab label="acme" />
          <Tab label="Downloads" active={false} />
          <Tab label="api" active={false} />
        </>
      }
      toolbar={<WindowToolbar />}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Grid dividers */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: colors.divider,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: colors.divider,
          }}
        />

        {/* Static panes */}
        <Cell pos={TL}>
          <PanePrompt path="~/dev/acme" active />
        </Cell>
        <Cell pos={BR}>
          <PanePrompt path="~/Desktop" />
        </Cell>

        {/* Pane B: bottom-left -> top-right */}
        <Cell pos={bPos} z={2}>
          <PanePrompt path="~/dev/api" />
        </Cell>

        {/* Dashed destination ghost at bottom-left */}
        <Cell pos={BL} z={4} style={{ opacity: ghost, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              inset: 12,
              borderRadius: 8,
              border: `2px dashed ${colors.brand}`,
              backgroundColor: 'rgba(10,132,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpRight size={48} color={colors.brand} strokeWidth={2.4} />
          </div>
        </Cell>

        {/* Pane A: top-right -> bottom-left (grabbed, solid highlight) */}
        <Cell pos={aPos} z={5}>
          <PanePrompt path="~/Downloads" />
          <div
            style={{
              position: 'absolute',
              inset: 10,
              borderRadius: 8,
              border: `2px solid ${colors.brand}`,
              backgroundColor: 'rgba(10,132,255,0.14)',
              boxShadow: `0 0 40px ${colors.brandGlow}`,
              opacity: highlight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDownLeft size={48} color={colors.brand} strokeWidth={2.4} />
          </div>
        </Cell>
      </div>
    </KommandoWindow>
  );
};
