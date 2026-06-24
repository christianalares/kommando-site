import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { MONO_LH, MONO_SIZE, PromptLine } from '../components/terminal/parts';
import { LS_ENTRIES, LsRow } from '../components/terminal/ls';
import { SPACES, SpaceChip, SpacesPanel } from '../components/SpacesUI';
import { Cursor, ClickRipple } from '../components/Cursor';
import { colors } from '../theme';

const POPOVER_LEFT = 40;
const POPOVER_TOP = 6;

// Vertical centre of each space row inside the popover (body coordinates).
const ROW_Y = [69, 113, 157];
const ROW_X = 150;

const CLICK = 74;
const COMMIT = 86;

export const SceneSpaces: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearOpen = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200, mass: 0.6 },
    durationInFrames: 16,
  });
  const close = interpolate(frame, [CLICK + 4, CLICK + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const appear = appearOpen * (1 - close);

  // Cursor walks Acme -> Dotfiles -> Infra, then presses.
  const cx = interpolate(
    frame,
    [8, 22, 34, 46, 56, 68],
    [ROW_X - 40, ROW_X, ROW_X, ROW_X, ROW_X, ROW_X],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const cy = interpolate(
    frame,
    [8, 22, 34, 46, 56, 68],
    [ROW_Y[0] + 26, ROW_Y[0], ROW_Y[0], ROW_Y[1], ROW_Y[1], ROW_Y[2]],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  let highlightIndex = 0;
  if (frame >= 56) {
    highlightIndex = 2;
  } else if (frame >= 40) {
    highlightIndex = 1;
  }

  const press = frame >= CLICK && frame < CLICK + 7;
  // Old workspace clears quickly; the new one fades in just after, so the two
  // terminals never stack on the same line.
  const acmeOut = interpolate(frame, [COMMIT, COMMIT + 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const infraIn = interpolate(frame, [COMMIT + 4, COMMIT + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const switched = frame >= COMMIT;

  const cursorGone = interpolate(frame, [CLICK + 8, CLICK + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <KommandoWindow
      width={width}
      height={height}
      spaceChip={
        switched ? (
          <SpaceChip letter="I" color={SPACES[2].color} />
        ) : (
          <SpaceChip letter="A" color={SPACES[0].color} />
        )
      }
      tabs={<Tab label={switched ? 'infra' : 'acme'} />}
      toolbar={<WindowToolbar />}
    >
      {/* Terminal backdrop — crossfades from the Acme workspace to the new one */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '22px 26px',
            opacity: acmeOut,
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
            <PromptLine command="" cursor />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '22px 26px',
            opacity: infraIn,
          }}
        >
          <PromptLine path="~/dev/infra" command="" cursor branch="main" />
        </div>
      </div>

      {/* Spaces popover */}
      <div style={{ position: 'absolute', left: POPOVER_LEFT, top: POPOVER_TOP }}>
        <SpacesPanel activeIndex={0} highlightIndex={highlightIndex} appear={appear} />
        {/* caret poking up out of the panel, pointing at the space chip */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: -7,
            width: 15,
            height: 15,
            backgroundColor: colors.panel,
            borderLeft: `1px solid ${colors.border}`,
            borderTop: `1px solid ${colors.border}`,
            transform: 'rotate(45deg)',
            borderTopLeftRadius: 3,
            opacity: appear,
          }}
        />
      </div>

      {/* Pointer */}
      <div style={{ opacity: cursorGone }}>
        <Cursor x={POPOVER_LEFT + cx} y={POPOVER_TOP + cy} press={press} />
      </div>
      <ClickRipple x={POPOVER_LEFT + ROW_X} y={POPOVER_TOP + ROW_Y[2]} clickFrame={CLICK} />
    </KommandoWindow>
  );
};
