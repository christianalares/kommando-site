import { CheckCircle2, Columns2, Plug, TerminalSquare } from 'lucide-react';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { Sans } from '../components/sidebar/parts';
import { colors, fonts, radius } from '../theme';
import { flush } from './frame';

const NOVA_W = 560;
const NOVA_RIGHT = 44;
const REGION_GAP = 40;
const APP_NAME = 'Random AI app';
const APP_GRAD = 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)';
const ACCENT = colors.violet;

const RainbowSpark: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="rainbowSparkShot" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff5f6d" />
        <stop offset="0.25" stopColor="#ffc371" />
        <stop offset="0.5" stopColor="#5eead4" />
        <stop offset="0.75" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <path
      d="M12 2 C12.6 7 17 11.4 22 12 C17 12.6 12.6 17 12 22 C11.4 17 7 12.6 2 12 C7 11.4 11.4 7 12 2 Z"
      fill="url(#rainbowSparkShot)"
    />
  </svg>
);

const M: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
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

const Prompt: React.FC<{ command?: string; cursor?: boolean }> = ({ command, cursor }) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <M style={{ color: colors.promptPath, fontWeight: 500 }}>~/dev/acme</M>
    <M style={{ color: colors.promptChevron, fontWeight: 700 }}>{' \u203a '}</M>
    {command ? <M style={{ color: colors.fg }}>{command}</M> : null}
    {cursor ? (
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 15,
          marginLeft: 3,
          marginBottom: -2,
          borderRadius: 1.5,
          backgroundColor: colors.fg,
          opacity: 0.9,
        }}
      />
    ) : null}
  </div>
);

const dot = (color: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
});

const ToolCard: React.FC<{ tool: string; arg: string; icon: React.ReactNode }> = ({
  tool,
  arg,
  icon,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 14px',
      borderRadius: radius.card,
      backgroundColor: colors.surface,
      border: `1px solid rgba(168,85,247,0.32)`,
    }}
  >
    <div style={{ color: ACCENT, display: 'flex' }}>{icon}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
      <Sans style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>kommando · {tool}</Sans>
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
    <CheckCircle2 size={19} color={colors.checkGreen} strokeWidth={2.2} />
  </div>
);

const Bubble: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <div style={{ maxWidth: '84%', padding: '10px 14px', borderRadius: radius.pill, background: APP_GRAD }}>
      <Sans style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>{children}</Sans>
    </div>
  </div>
);

const Reply: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Sans style={{ fontSize: 14.5, color: colors.fgDim, lineHeight: 1.5 }}>{children}</Sans>
);

const Status: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
    <CheckCircle2 size={17} color={colors.checkGreen} strokeWidth={2.2} style={{ marginTop: 2, flexShrink: 0 }} />
    <Sans style={{ fontSize: 14, color: colors.fg, lineHeight: 1.5 }}>{children}</Sans>
  </div>
);

/** Static showcase shot of another AI app driving Kommando over MCP. */
export const ShotMcp: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const regionW = width - NOVA_W - NOVA_RIGHT - REGION_GAP;
  const half = regionW / 2;

  return (
    <KommandoWindow
      width={width}
      height={height}
      style={flush}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
    >
      {/* Terminal region with two panes */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: regionW }}>
        {/* Left pane — port freed */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: half, padding: '22px 26px' }}>
          <Prompt command="lsof -i :3000" />
          <div style={{ marginTop: 3 }}>
            <M style={{ color: colors.muted }}>{'COMMAND   PID  USER   FD   TYPE  NAME'}</M>
            <div>
              <M style={{ color: colors.green }}>{'node     '}</M>
              <M style={{ color: colors.fg }}>{'4821 john   23u  IPv4  '}</M>
              <M style={{ color: colors.cyan }}>{'*:3000'}</M>
              <M style={{ color: colors.fgDim }}>{' (LISTEN)'}</M>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>
            <Prompt command="kill -9 4821" />
          </div>
          <div style={{ marginTop: 6 }}>
            <Prompt cursor />
          </div>
        </div>

        {/* Divider */}
        <div style={{ position: 'absolute', left: half, top: 0, bottom: 0, width: 1, backgroundColor: colors.divider }} />

        {/* Right pane — dev server (active) */}
        <div style={{ position: 'absolute', left: half + 1, top: 0, bottom: 0, width: half - 1, padding: '22px 26px' }}>
          <div
            style={{
              position: 'absolute',
              inset: 8,
              borderRadius: 8,
              border: `1.5px solid ${colors.brand}`,
              boxShadow: `inset 0 0 0 9999px rgba(10,132,255,0.04)`,
              pointerEvents: 'none',
            }}
          />
          <Prompt command="npm run dev" />
          <div>
            <M style={{ color: colors.muted }}>{'> acme@0.1.0 dev'}</M>
          </div>
          <div>
            <M style={{ color: colors.muted }}>{'> vite dev --port 3000'}</M>
          </div>
          <div style={{ height: 14 }} />
          <div>
            <M style={{ color: colors.green, fontWeight: 700 }}>{'  VITE '}</M>
            <M style={{ color: colors.muted }}>{'v7.3.1  ready in '}</M>
            <M style={{ color: colors.fg, fontWeight: 700 }}>{'979'}</M>
            <M style={{ color: colors.muted }}>{' ms'}</M>
          </div>
          <div style={{ height: 8 }} />
          <div>
            <M style={{ color: colors.green }}>{'  \u2192  '}</M>
            <M style={{ color: colors.fg, fontWeight: 700 }}>{'Local:   '}</M>
            <M style={{ color: colors.fgDim }}>{'http://localhost:'}</M>
            <M style={{ color: colors.cyan, fontWeight: 700 }}>{'3000'}</M>
            <M style={{ color: colors.fgDim }}>{'/'}</M>
          </div>
          <div>
            <M style={{ color: colors.green }}>{'  \u2192  '}</M>
            <M style={{ color: colors.fg, fontWeight: 700 }}>{'Network: '}</M>
            <M style={{ color: colors.fgDim }}>{'http://192.168.1.187:'}</M>
            <M style={{ color: colors.cyan, fontWeight: 700 }}>{'3000'}</M>
            <M style={{ color: colors.fgDim }}>{'/'}</M>
          </div>
        </div>
      </div>

      {/* The other AI app window */}
      <div
        style={{
          position: 'absolute',
          top: 54,
          right: NOVA_RIGHT,
          width: NOVA_W,
          height: height - 50 - 96,
          borderRadius: 14,
          backgroundColor: colors.panel,
          border: `1px solid ${colors.border}`,
          boxShadow:
            '0 40px 110px -22px rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.28)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Titlebar */}
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
            <span style={dot(colors.tlRed)} />
            <span style={dot(colors.tlYellow)} />
            <span style={dot(colors.tlGreen)} />
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
          <Sans style={{ fontSize: 14.5, fontWeight: 600, color: colors.fgDim }}>{APP_NAME}</Sans>
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
          <Plug size={13} color={ACCENT} strokeWidth={2.4} />
          <Sans style={{ fontSize: 12.5, color: colors.muted }}>Connected to</Sans>
          <Sans style={{ fontSize: 12.5, color: colors.fgDim, fontWeight: 600 }}>Kommando MCP</Sans>
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
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <Bubble>Kill whatever&apos;s running on port 3000</Bubble>
          <Reply>On it — let me find the process bound to that port and stop it.</Reply>
          <ToolCard tool="run_command" arg="lsof -i :3000" icon={<TerminalSquare size={17} strokeWidth={2} />} />
          <ToolCard tool="run_command" arg="kill -9 4821" icon={<TerminalSquare size={17} strokeWidth={2} />} />
          <Status>
            Port <strong style={{ color: colors.fg }}>3000</strong> is free now.
          </Status>
          <Bubble>Great. Now start the dev server in a new pane</Bubble>
          <Reply>Sure — I&apos;ll open a new pane and boot it there.</Reply>
          <ToolCard tool="open_pane" arg="split right · ~/dev/acme" icon={<Columns2 size={17} strokeWidth={2} />} />
          <ToolCard tool="run_command" arg="npm run dev  (pane 2)" icon={<TerminalSquare size={17} strokeWidth={2} />} />
          <Status>
            Dev server is live at <strong style={{ color: colors.fg }}>localhost:3000</strong>.
          </Status>
        </div>
      </div>
    </KommandoWindow>
  );
};
