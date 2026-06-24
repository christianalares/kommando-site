import { Check } from 'lucide-react';
import { MONO_LH, MONO_SIZE, Mono, PromptLine } from './terminal/parts';
import { colors, fonts } from '../theme';

const LH = MONO_SIZE * MONO_LH;
export const CB_PAD_TOP = 22;
export const CB_PAD_X = 26;

type Line =
  | { type: 'prompt'; command: string; cursor?: boolean }
  | { type: 'out'; text: string; color?: string }
  | { type: 'blank' };

// Two finished command blocks on the acme project, then the live prompt.
const LINES: Line[] = [
  { type: 'prompt', command: 'npm run build' },
  { type: 'out', text: '> acme@0.1.0 build', color: colors.muted },
  { type: 'out', text: '> vite build', color: colors.muted },
  { type: 'blank' },
  { type: 'out', text: 'vite v5.4.2 building for production...', color: colors.fgDim },
  { type: 'out', text: '✓ 42 modules transformed.', color: colors.green },
  { type: 'out', text: 'dist/index.html   0.46 kB', color: colors.fgDim },
  { type: 'out', text: '✓ built in 1.21s', color: colors.green },
  { type: 'blank' },
  { type: 'prompt', command: 'git status' },
  { type: 'out', text: 'On branch main', color: colors.fg },
  { type: 'out', text: "Your branch is up to date with 'origin/main'.", color: colors.fgDim },
  { type: 'blank' },
  { type: 'out', text: 'nothing to commit, working tree clean', color: colors.green },
  { type: 'blank' },
  { type: 'prompt', command: '', cursor: true },
];

// [startLineIndex, endLineIndex] (inclusive) for each selectable block.
const BLOCKS: Array<[number, number]> = [
  [0, 7],
  [9, 13],
];

/** Pixel rect of a block, in terminal-content coordinates. */
export const blockRect = (index: number) => {
  const [a, b] = BLOCKS[index];
  return {
    top: CB_PAD_TOP + a * LH,
    height: (b - a + 1) * LH,
  };
};

const OutLine: React.FC<{ text: string; color?: string }> = ({ text, color }) => (
  <div style={{ height: LH, display: 'flex', alignItems: 'center' }}>
    <Mono style={{ color: color ?? colors.fg }}>{text}</Mono>
  </div>
);

/**
 * The terminal body for the Command Blocks feature: renders the run history and,
 * when `selected` is set, draws the inset highlight card over that block with a
 * green success bar on its right edge. `copied` flashes the "Copied" pill.
 */
export const CommandBlocksTerminal: React.FC<{
  selected: number | null;
  copied?: boolean;
}> = ({ selected, copied = false }) => {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Selection card (behind the text so glyphs stay crisp) */}
      {selected !== null
        ? (() => {
            const r = blockRect(selected);
            return (
              <div
                style={{
                  position: 'absolute',
                  left: CB_PAD_X - 12,
                  right: CB_PAD_X - 12,
                  top: r.top - 6,
                  height: r.height + 12,
                  borderRadius: 8,
                  backgroundColor: 'rgba(10,132,255,0.10)',
                  border: '1.5px solid rgba(10,132,255,0.5)',
                }}
              >
                {/* status bar (green = exit 0) on the right edge */}
                <div
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 6,
                    bottom: 6,
                    width: 3,
                    borderRadius: 2,
                    backgroundColor: colors.checkGreen,
                  }}
                />
                {/* "Copied" pill, top-right of the block */}
                {copied ? (
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: -15,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px 4px 8px',
                      borderRadius: 999,
                      backgroundColor: colors.brand,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Check size={13} color="#fff" strokeWidth={3} />
                    <span
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                      }}
                    >
                      Copied
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })()
        : null}

      {/* Terminal text */}
      <div style={{ position: 'absolute', inset: 0, padding: `${CB_PAD_TOP}px ${CB_PAD_X}px` }}>
        {LINES.map((line, i) => {
          if (line.type === 'blank') {
            return <div key={i} style={{ height: LH }} />;
          }
          if (line.type === 'prompt') {
            return (
              <div key={i} style={{ height: LH, display: 'flex', alignItems: 'center' }}>
                <PromptLine
                  command={line.command}
                  cursor={line.cursor}
                  dirty={false}
                  showBranch={false}
                />
              </div>
            );
          }
          return <OutLine key={i} text={line.text} color={line.color} />;
        })}
      </div>
    </div>
  );
};
