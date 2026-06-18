import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { colors, fonts } from '../theme';
import { flush } from './frame';

const M: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: 15,
      lineHeight: 1.6,
      whiteSpace: 'pre',
      ...style,
    }}
  >
    {children}
  </span>
);

const Prompt: React.FC<{ path: string; command?: string; cursor?: boolean }> = ({
  path,
  command,
  cursor,
}) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <M style={{ color: colors.promptPath, fontWeight: 500 }}>{path}</M>
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

const Pane: React.FC<{
  pos: { left: number; top: number };
  focused?: boolean;
  children: React.ReactNode;
}> = ({ pos, focused, children }) => (
  <div
    style={{
      position: 'absolute',
      left: `${pos.left}%`,
      top: `${pos.top}%`,
      width: '50%',
      height: '50%',
      padding: '18px 22px',
      overflow: 'hidden',
      opacity: focused ? 1 : 0.82,
    }}
  >
    {children}
    {focused ? (
      <div
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius: 8,
          border: `1.5px solid ${colors.brand}`,
          boxShadow: `inset 0 0 0 9999px rgba(10,132,255,0.04)`,
          pointerEvents: 'none',
        }}
      />
    ) : null}
  </div>
);

/** Static showcase shot of a window tiled into split panes + tabs. */
export const ShotPanes: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  return (
    <KommandoWindow
      width={width}
      height={height}
      style={flush}
      tabs={
        <>
          <Tab label="acme" />
          <Tab label="api" active={false} />
          <Tab label="logs" active={false} />
        </>
      }
      toolbar={<WindowToolbar />}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* dividers */}
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

        {/* TL — dev server (focused) */}
        <Pane pos={{ left: 0, top: 0 }} focused>
          <Prompt path="~/dev/acme" command="npm run dev" />
          <div>
            <M style={{ color: colors.muted }}>{'> acme@0.1.0 dev'}</M>
          </div>
          <div>
            <M style={{ color: colors.muted }}>{'> vite dev --port 3000'}</M>
          </div>
          <div style={{ height: 12 }} />
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
        </Pane>

        {/* TR — git status */}
        <Pane pos={{ left: 50, top: 0 }}>
          <Prompt path="~/dev/acme" command="git status" />
          <div>
            <M style={{ color: colors.fgDim }}>{'On branch '}</M>
            <M style={{ color: colors.green }}>{'main'}</M>
          </div>
          <div>
            <M style={{ color: colors.fgDim }}>{'Changes not staged for commit:'}</M>
          </div>
          <div>
            <M style={{ color: colors.red }}>{'  modified:   src/App.tsx'}</M>
          </div>
          <div>
            <M style={{ color: colors.red }}>{'  modified:   src/lib/api.ts'}</M>
          </div>
          <div style={{ height: 6 }} />
          <div>
            <M style={{ color: colors.fgDim }}>{'Untracked files:'}</M>
          </div>
          <div>
            <M style={{ color: colors.red }}>{'  src/components/Chart.tsx'}</M>
          </div>
        </Pane>

        {/* BL — tests */}
        <Pane pos={{ left: 0, top: 50 }}>
          <Prompt path="~/dev/acme" command="npm test" />
          <div style={{ height: 4 }} />
          <div>
            <M
              style={{
                color: '#0b3d1e',
                backgroundColor: colors.green,
                fontWeight: 700,
                borderRadius: 3,
              }}
            >
              {' PASS '}
            </M>
            <M style={{ color: colors.fgDim }}>{'  tests/api.test.ts'}</M>
          </div>
          <div>
            <M
              style={{
                color: '#0b3d1e',
                backgroundColor: colors.green,
                fontWeight: 700,
                borderRadius: 3,
              }}
            >
              {' PASS '}
            </M>
            <M style={{ color: colors.fgDim }}>{'  tests/format.test.ts'}</M>
          </div>
          <div style={{ height: 8 }} />
          <div>
            <M style={{ color: colors.muted }}>{'Tests:  '}</M>
            <M style={{ color: colors.green, fontWeight: 700 }}>{'24 passed'}</M>
            <M style={{ color: colors.muted }}>{', 24 total'}</M>
          </div>
          <div>
            <M style={{ color: colors.muted }}>{'Time:   1.82 s'}</M>
          </div>
        </Pane>

        {/* BR — scratch shell */}
        <Pane pos={{ left: 50, top: 50 }}>
          <Prompt path="~/Downloads" command="ls" />
          <div>
            <M style={{ color: colors.dir, fontWeight: 700 }}>{'assets'}</M>
            <M style={{ color: colors.fg }}>{'    '}</M>
            <M style={{ color: colors.fg }}>{'kommando.dmg'}</M>
          </div>
          <div>
            <M style={{ color: colors.fg }}>{'report.pdf    notes.md'}</M>
          </div>
          <div style={{ height: 4 }} />
          <Prompt path="~/Downloads" cursor />
        </Pane>
      </div>
    </KommandoWindow>
  );
};
