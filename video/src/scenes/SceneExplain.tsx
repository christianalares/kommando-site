import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { StreamingChat, ChatBlock } from '../components/StreamingChat';
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
import {
  EXPLANATION,
  ExplItem,
  explItemHeight,
} from '../components/sidebar/Explanation';
import { typedSlice, typingEndFrame } from '../lib/typing';
import { colors } from '../theme';

const QUESTION = 'Explain the file tree';
const Q_TYPE_START = 22;
const Q_CPS = 30;

const CMD = 'lsd --tree --depth 3 -a --ignore-glob .git';
const CMD_TYPE_START = 56;
const CMD_CPS = 46;

const INSERT_CARD = 50;
const READ_CARD = 108;
const EXPL_START = 122;
// Streaming is front-loaded: lines pour in quickly, then ease out near the end
// so the finished answer lingers before we move on.
const STREAM_DUR = 42;
const explAt = (i: number, n: number) =>
  EXPL_START + STREAM_DUR * Math.pow(i / (n - 1), 1.65);

export const SceneExplain: React.FC<{
  width: number;
  height: number;
  sidebarWidth: number;
}> = ({ width, height, sidebarWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sidebar slides open.
  const open = spring({
    frame: frame - 8,
    fps,
    config: { damping: 20, mass: 0.7 },
  });
  const rightWidth = open * sidebarWidth;
  const contentOpacity = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Question typed into the input, then sent.
  const qDone = typingEndFrame(Q_TYPE_START, QUESTION.length, Q_CPS);
  const sendAt = qDone + 6;
  const qTyped = typedSlice(QUESTION, frame, Q_TYPE_START, Q_CPS);
  const sent = frame >= sendAt;

  // Command inserted + auto-run in the terminal.
  const cmdTyped = typedSlice(CMD, frame, CMD_TYPE_START, CMD_CPS);
  const runAt = typingEndFrame(CMD_TYPE_START, CMD.length, CMD_CPS) + 4;
  const treeStart = runAt + 3;
  const perLine = 1.0;
  const treeVisible =
    frame < treeStart
      ? 0
      : Math.min(TREE.length, Math.floor((frame - treeStart) / perLine) + 1);

  // Deterministic stream of chat blocks: every block has a known height, so the
  // scroll offset is a pure function of the frame (no DOM measurement).
  const blocks: ChatBlock[] = [
    {
      at: sendAt,
      h: 50,
      node: <UserPill text={QUESTION} />,
    },
    {
      at: INSERT_CARD,
      h: 54,
      node: <ToolCard kind="insert" label="Insert command" />,
    },
    {
      at: READ_CARD,
      h: 54,
      node: <ToolCard kind="read" label="Read terminal output" />,
    },
    ...EXPLANATION.map((item, i) => ({
      at: explAt(i, EXPLANATION.length),
      h: explItemHeight(item),
      node: <ExplItem item={item} />,
    })),
  ];

  return (
    <KommandoWindow
      width={width}
      height={height}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
      rightWidth={rightWidth}
      rightHeader={
        <div style={{ opacity: contentOpacity, width: '100%' }}>
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
            opacity: contentOpacity,
          }}
        >
          <div style={{ flex: 1, minHeight: 0, padding: '18px 18px 4px' }}>
            <StreamingChat viewport={760} blocks={blocks} />
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
            <SidebarInput
              value={sent ? '' : qTyped}
              cursor={!sent && frame >= Q_TYPE_START}
              active
            />
          </div>
        </div>
      }
    >
      {/* Terminal (left): command inserted by the AI, then file tree */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {frame >= CMD_TYPE_START - 2 ? (
          <PromptLine command={cmdTyped} cursor={frame < runAt} dirty />
        ) : (
          <PromptLine command="" cursor dirty />
        )}

        {treeVisible > 0 ? (
          <div style={{ marginTop: 6 }}>
            {TREE.slice(0, treeVisible).map((line, i) => (
              <div
                key={i}
                style={{ height: MONO_SIZE * MONO_LH, overflow: 'hidden' }}
              >
                <FileTreeRow line={line} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </KommandoWindow>
  );
};
