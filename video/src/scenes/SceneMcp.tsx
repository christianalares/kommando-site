import {
  ArrowUp,
  CheckCircle2,
  Columns2,
  Loader2,
  Plug,
  TerminalSquare,
} from 'lucide-react';
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BlockCursor } from '../components/BlockCursor';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { Sans } from '../components/sidebar/parts';
import { typedSlice } from '../lib/typing';
import { colors, fonts, radius } from '../theme';

const LSOF = 'lsof -i :3000';
const KILL = 'kill -9 4821';
const DEV = 'npm run dev';

const APP_NAME = 'Random AI app';
const APP_GRAD = 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)';

// ── Phase 1: the user asks it to free the port ──────────────────────────────
const USER1_AT = 14;
const REPLY1_AT = 28;

const T1_AT = 40;
const LSOF_TYPE = 46;
const LSOF_RUN = LSOF_TYPE + LSOF.length + 2; // 61
const LSOF_OUT = LSOF_RUN + 3; // 64

const T2_AT = 78;
const KILL_TYPE = 84;
const KILL_RUN = KILL_TYPE + KILL.length + 2; // 98
const KILL_DONE = KILL_RUN + 3; // 101

const CONFIRM1_AT = 110;

// ── Phase 2: the user asks it to start the dev server in a new pane ──────────
const USER2_AT = 132;
const REPLY2_AT = 146;

const T3_AT = 158;
const SPLIT_START = 164;
const SPLIT_END = 184;

const T4_AT = 196;
const DEV_TYPE = 202;
const DEV_RUN = DEV_TYPE + DEV.length + 2; // 215
const NPM_AT = DEV_RUN + 2; // 217
const VITE_READY = NPM_AT + 16; // 233
const VITE_LOCAL = VITE_READY + 6;
const VITE_NET = VITE_READY + 11;
const VITE_HELP = VITE_READY + 16;

const FINAL_AT = 264;

const NOVA_W = 560;
const NOVA_RIGHT = 44;
const REGION_GAP = 40;

const RainbowSpark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient
        id="rainbowSpark"
        x1="2"
        y1="2"
        x2="22"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ff5f6d" />
        <stop offset="0.25" stopColor="#ffc371" />
        <stop offset="0.5" stopColor="#5eead4" />
        <stop offset="0.75" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <path
      d="M12 2 C12.6 7 17 11.4 22 12 C17 12.6 12.6 17 12 22 C11.4 17 7 12.6 2 12 C7 11.4 11.4 7 12 2 Z"
      fill="url(#rainbowSpark)"
    />
  </svg>
);

const PaneMono: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: 16,
      lineHeight: 1.62,
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </span>
);

const PanePrompt: React.FC<{ command?: React.ReactNode; cursor?: boolean }> = ({
  command,
  cursor,
}) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <PaneMono style={{ color: colors.promptPath, fontWeight: 500 }}>
      ~/dev/acme
    </PaneMono>
    <PaneMono style={{ color: colors.promptChevron, fontWeight: 700 }}>
      {' \u203a '}
    </PaneMono>
    <PaneMono style={{ color: colors.fg }}>{command}</PaneMono>
    {cursor ? <BlockCursor width={8} height={15} /> : null}
  </div>
);

const Spinner: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ transform: `rotate(${frame * 16}deg)`, display: 'flex' }}>
      <Loader2 size={17} color={color} strokeWidth={2.4} />
    </div>
  );
};

const ToolCall: React.FC<{
  tool: string;
  arg: string;
  icon: React.ReactNode;
  done: boolean;
  appear: number;
}> = ({ tool, arg, icon, done, appear }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appear, appear + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        borderRadius: radius.card,
        backgroundColor: colors.surface,
        border: `1px solid rgba(168,85,247,0.32)`,
        opacity: p,
        transform: `translateY(${Math.round((1 - p) * 8)}px)`,
      }}
    >
      <div style={{ color: colors.violet, display: 'flex' }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
        <Sans style={{ fontSize: 12, color: colors.violet, fontWeight: 600 }}>
          kommando · {tool}
        </Sans>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 13.5,
            color: colors.fgDim,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {arg}
        </span>
      </div>
      {done ? (
        <CheckCircle2 size={19} color={colors.checkGreen} strokeWidth={2.2} />
      ) : (
        <Spinner color={colors.violet} />
      )}
    </div>
  );
};

const Reveal: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${Math.round((1 - p) * 8)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const UserBubble: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => (
  <Reveal at={at} style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <div
      style={{
        maxWidth: '84%',
        padding: '10px 14px',
        borderRadius: radius.pill,
        background: APP_GRAD,
      }}
    >
      <Sans style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>
        {children}
      </Sans>
    </div>
  </Reveal>
);

const StatusLine: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => (
  <Reveal at={at}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
      <CheckCircle2
        size={17}
        color={colors.checkGreen}
        strokeWidth={2.2}
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <Sans style={{ fontSize: 14, color: colors.fg, lineHeight: 1.5 }}>
        {children}
      </Sans>
    </div>
  </Reveal>
);

const NovaDot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
    }}
  />
);

export const SceneMcp: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - 2,
    fps,
    config: { damping: 22, mass: 0.8 },
  });
  const panelX = (1 - enter) * 70;

  const regionW = width - NOVA_W - NOVA_RIGHT - REGION_GAP;

  const split = interpolate(frame, [SPLIT_START, SPLIT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const leftW = regionW - (regionW / 2) * split;
  const newPaneGlow = interpolate(
    frame,
    [SPLIT_START + 2, SPLIT_END, SPLIT_END + 22],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const lsofTyped = typedSlice(LSOF, frame, LSOF_TYPE, 30);
  const killTyped = typedSlice(KILL, frame, KILL_TYPE, 30);
  const devTyped = typedSlice(DEV, frame, DEV_TYPE, 30);

  return (
    <KommandoWindow
      width={width}
      height={height}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
    >
      {/* Kommando terminal region (left of the app window) */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: regionW }}>
        {/* Left pane — freeing the port */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: leftW,
            padding: '22px 26px',
            overflow: 'hidden',
          }}
        >
          {frame >= LSOF_TYPE - 2 ? (
            <PanePrompt command={lsofTyped} cursor={frame < LSOF_RUN} />
          ) : (
            <PanePrompt command="" cursor />
          )}

          {frame >= LSOF_OUT ? (
            <div style={{ marginTop: 3 }}>
              <PaneMono style={{ color: colors.muted }}>
                {'COMMAND   PID  USER   FD   TYPE  NAME'}
              </PaneMono>
              <div>
                <PaneMono style={{ color: colors.green }}>{'node     '}</PaneMono>
                <PaneMono style={{ color: colors.fg }}>{'4821 john   23u  IPv4  '}</PaneMono>
                <PaneMono style={{ color: colors.cyan }}>{'*:3000'}</PaneMono>
                <PaneMono style={{ color: colors.fgDim }}>{' (LISTEN)'}</PaneMono>
              </div>
            </div>
          ) : null}

          {frame >= KILL_TYPE - 2 ? (
            <div style={{ marginTop: 6 }}>
              <PanePrompt command={killTyped} cursor={frame < KILL_RUN} />
            </div>
          ) : null}

          {frame >= KILL_DONE ? (
            <div style={{ marginTop: 6 }}>
              <PanePrompt command="" cursor={split < 0.5} />
            </div>
          ) : null}
        </div>

        {/* Divider between panes */}
        {split > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: leftW,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: colors.divider,
              opacity: split,
            }}
          />
        ) : null}

        {/* Right pane — the new pane running the dev server */}
        {frame >= SPLIT_START ? (
          <div
            style={{
              position: 'absolute',
              left: leftW + 1,
              top: 0,
              bottom: 0,
              width: regionW - leftW - 1,
              padding: '22px 26px',
              overflow: 'hidden',
              opacity: split,
            }}
          >
            {/* new-pane active highlight */}
            <div
              style={{
                position: 'absolute',
                inset: 8,
                borderRadius: 8,
                border: `2px solid ${colors.brand}`,
                boxShadow: `0 0 36px ${colors.brandGlow}`,
                opacity: newPaneGlow,
                pointerEvents: 'none',
              }}
            />

            {frame >= DEV_TYPE - 2 ? (
              <PanePrompt command={devTyped} cursor={frame < DEV_RUN} />
            ) : (
              <PanePrompt command="" cursor />
            )}

            {frame >= NPM_AT ? (
              <div style={{ marginTop: 2 }}>
                <div>
                  <PaneMono style={{ color: colors.muted }}>{'> acme@0.1.0 dev'}</PaneMono>
                </div>
                <div>
                  <PaneMono style={{ color: colors.muted }}>{'> vite dev --port 3000'}</PaneMono>
                </div>
              </div>
            ) : null}

            {frame >= VITE_READY ? (
              <div style={{ marginTop: 14 }}>
                <div>
                  <PaneMono style={{ color: colors.green, fontWeight: 700 }}>{'  VITE '}</PaneMono>
                  <PaneMono style={{ color: colors.muted }}>{'v7.3.1  '}</PaneMono>
                  <PaneMono style={{ color: colors.muted }}>{'ready in '}</PaneMono>
                  <PaneMono style={{ color: colors.fg, fontWeight: 700 }}>{'979'}</PaneMono>
                  <PaneMono style={{ color: colors.muted }}>{' ms'}</PaneMono>
                </div>
              </div>
            ) : null}

            {frame >= VITE_LOCAL ? (
              <div style={{ marginTop: 10 }}>
                <PaneMono style={{ color: colors.green }}>{'  \u2192  '}</PaneMono>
                <PaneMono style={{ color: colors.fg, fontWeight: 700 }}>{'Local:   '}</PaneMono>
                <PaneMono style={{ color: colors.fgDim }}>{'http://localhost:'}</PaneMono>
                <PaneMono style={{ color: colors.cyan, fontWeight: 700 }}>{'3000'}</PaneMono>
                <PaneMono style={{ color: colors.fgDim }}>{'/'}</PaneMono>
              </div>
            ) : null}

            {frame >= VITE_NET ? (
              <div>
                <PaneMono style={{ color: colors.green }}>{'  \u2192  '}</PaneMono>
                <PaneMono style={{ color: colors.fg, fontWeight: 700 }}>{'Network: '}</PaneMono>
                <PaneMono style={{ color: colors.fgDim }}>{'http://192.168.1.187:'}</PaneMono>
                <PaneMono style={{ color: colors.cyan, fontWeight: 700 }}>{'3000'}</PaneMono>
                <PaneMono style={{ color: colors.fgDim }}>{'/'}</PaneMono>
              </div>
            ) : null}

            {frame >= VITE_HELP ? (
              <div>
                <PaneMono style={{ color: colors.faint }}>{'  \u2192  '}</PaneMono>
                <PaneMono style={{ color: colors.muted }}>{'press '}</PaneMono>
                <PaneMono style={{ color: colors.fgDim, fontWeight: 700 }}>{'h + enter'}</PaneMono>
                <PaneMono style={{ color: colors.muted }}>{' to show help'}</PaneMono>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* The other AI app — its own window floating on top */}
      <div
        style={{
          position: 'absolute',
          top: 54,
          right: NOVA_RIGHT,
          width: NOVA_W,
          height: height - 50 - 96,
          opacity: enter,
          transform: `translateX(${panelX}px)`,
          borderRadius: 14,
          backgroundColor: colors.panel,
          border: `1px solid ${colors.border}`,
          boxShadow:
            '0 40px 110px -22px rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.28)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* App titlebar — traffic lights make it read as its own window */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 46,
            flexShrink: 0,
            padding: '0 14px',
            borderBottom: `1px solid ${colors.divider}`,
            backgroundColor: colors.surface,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <NovaDot color={colors.tlRed} />
            <NovaDot color={colors.tlYellow} />
            <NovaDot color={colors.tlGreen} />
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              backgroundColor: colors.surfaceStrong,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RainbowSpark size={14} />
          </div>
          <Sans style={{ fontSize: 14.5, fontWeight: 600, color: colors.fgDim }}>
            {APP_NAME}
          </Sans>
          <div style={{ flex: 1 }} />
          <div style={{ width: 46 }} />
        </div>

        {/* Connection bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderBottom: `1px solid ${colors.divider}`,
          }}
        >
          <Plug size={13} color={colors.violet} strokeWidth={2.4} />
          <Sans style={{ fontSize: 12.5, color: colors.muted }}>
            Connected to
          </Sans>
          <Sans style={{ fontSize: 12.5, color: colors.fgDim, fontWeight: 600 }}>
            Kommando MCP
          </Sans>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: colors.checkGreen,
              boxShadow: `0 0 8px ${colors.checkGreen}`,
            }}
          />
        </div>

        {/* Conversation */}
        <div
          style={{
            flex: 1,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 0,
          }}
        >
          {/* Phase 1 — free the port */}
          <UserBubble at={USER1_AT}>Kill whatever&apos;s running on port 3000</UserBubble>

          <Reveal at={REPLY1_AT}>
            <Sans style={{ fontSize: 14.5, color: colors.fgDim, lineHeight: 1.5 }}>
              On it — let me find the process bound to that port and stop it.
            </Sans>
          </Reveal>

          {frame >= T1_AT ? (
            <ToolCall
              tool="run_command"
              arg={LSOF}
              icon={<TerminalSquare size={17} strokeWidth={2} />}
              done={frame >= LSOF_OUT}
              appear={T1_AT}
            />
          ) : null}

          {frame >= T2_AT ? (
            <ToolCall
              tool="run_command"
              arg={KILL}
              icon={<TerminalSquare size={17} strokeWidth={2} />}
              done={frame >= KILL_DONE}
              appear={T2_AT}
            />
          ) : null}

          {frame >= CONFIRM1_AT ? (
            <StatusLine at={CONFIRM1_AT}>
              Port <strong style={{ color: colors.fg }}>3000</strong> is free now.
            </StatusLine>
          ) : null}

          {/* Phase 2 — start the dev server in a new pane */}
          {frame >= USER2_AT ? (
            <UserBubble at={USER2_AT}>
              Great. Now start the dev server in a new pane
            </UserBubble>
          ) : null}

          {frame >= REPLY2_AT ? (
            <Reveal at={REPLY2_AT}>
              <Sans style={{ fontSize: 14.5, color: colors.fgDim, lineHeight: 1.5 }}>
                Sure — I&apos;ll open a new pane and boot it there.
              </Sans>
            </Reveal>
          ) : null}

          {frame >= T3_AT ? (
            <ToolCall
              tool="open_pane"
              arg="split right · ~/dev/acme"
              icon={<Columns2 size={17} strokeWidth={2} />}
              done={frame >= SPLIT_END}
              appear={T3_AT}
            />
          ) : null}

          {frame >= T4_AT ? (
            <ToolCall
              tool="run_command"
              arg="npm run dev  (pane 2)"
              icon={<TerminalSquare size={17} strokeWidth={2} />}
              done={frame >= VITE_READY}
              appear={T4_AT}
            />
          ) : null}

          {frame >= FINAL_AT ? (
            <StatusLine at={FINAL_AT}>
              Dev server is live at{' '}
              <strong style={{ color: colors.fg }}>localhost:3000</strong>.
            </StatusLine>
          ) : null}
        </div>

        {/* Input */}
        <div style={{ padding: '4px 16px 16px', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              height: 42,
              padding: '0 8px 0 15px',
              borderRadius: 11,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Sans style={{ fontSize: 14, color: colors.muted, flex: 1 }}>
              Message {APP_NAME}…
            </Sans>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: APP_GRAD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUp size={16} color="#fff" strokeWidth={2.6} />
            </div>
          </div>
        </div>
      </div>
    </KommandoWindow>
  );
};
