import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import {
  FileTreeRow,
  MONO_LH,
  MONO_SIZE,
  PromptLine,
  TREE,
} from '../components/terminal/parts';
import {
  AiSidebarHeader,
  AutoRunRow,
  SidebarInput,
  ToolCard,
  UserPill,
} from '../components/sidebar/parts';
import { EXPLANATION, ExplItem } from '../components/sidebar/Explanation';
import { colors } from '../theme';
import { flush } from './frame';

const CMD = 'lsd --tree --depth 3 -a --ignore-glob .git';

/** Static hero/showcase shot of the AI sidebar answering in context. */
export const ShotAi: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const sidebarWidth = 560;
  return (
    <KommandoWindow
      width={width}
      height={height}
      style={flush}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
      rightWidth={sidebarWidth}
      rightHeader={
        <div style={{ width: '100%' }}>
          <AiSidebarHeader title="Explain the file tree" />
        </div>
      }
      right={
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              padding: '18px 18px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <UserPill text="Explain the file tree" />
            <ToolCard kind="insert" label="Insert command" />
            <ToolCard kind="read" label="Read terminal output" />
            {EXPLANATION.map((item, i) => (
              <ExplItem key={i} item={item} />
            ))}
          </div>

          <div
            style={{
              padding: '10px 16px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              borderTop: `1px solid ${colors.divider}`,
            }}
          >
            <AutoRunRow />
            <SidebarInput active />
          </div>
        </div>
      }
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PromptLine command={CMD} dirty />
        <div style={{ marginTop: 6 }}>
          {TREE.map((line, i) => (
            <div key={i} style={{ height: MONO_SIZE * MONO_LH, overflow: 'hidden' }}>
              <FileTreeRow line={line} />
            </div>
          ))}
        </div>
      </div>
    </KommandoWindow>
  );
};
