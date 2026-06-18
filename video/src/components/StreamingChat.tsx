import { interpolate, useCurrentFrame } from 'remotion';

export type ChatBlock = {
  /** Frame at which this block starts fading in. */
  at: number;
  /** Fixed height (including the spacing below it). */
  h: number;
  node: React.ReactNode;
};

/**
 * Deterministic streaming chat viewport.
 *
 * Every block has an explicit, known height, so the total content height and
 * the scroll offset are pure functions of the current frame — there is no DOM
 * measurement, state, or effects. The scroll follows the reveal schedule
 * (whatever easing the caller used for each block's `at`), keeping the newest
 * line near the bottom once the content overflows.
 */
export const StreamingChat: React.FC<{
  viewport: number;
  blocks: ChatBlock[];
  /** Space kept below the newest revealed line once scrolling. */
  pad?: number;
  fade?: number;
}> = ({ viewport, blocks, pad = 64, fade = 6 }) => {
  const frame = useCurrentFrame();

  let acc = 0;
  const bottoms = blocks.map((b) => {
    acc += b.h;
    return acc;
  });
  const contentH = acc;
  const maxScroll = Math.max(0, contentH - viewport);

  const ats = blocks.map((b) => b.at);
  const revealedH =
    blocks.length > 1
      ? interpolate(frame, ats, bottoms, {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : (bottoms[0] ?? 0);

  const scroll = Math.round(
    Math.min(maxScroll, Math.max(0, revealedH - (viewport - pad))),
  );

  return (
    <div style={{ height: viewport, overflow: 'hidden' }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {blocks.map((b, i) => {
          const p = interpolate(frame, [b.at, b.at + fade], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                height: b.h,
                opacity: p,
                transform: `translateY(${Math.round((1 - p) * 6)}px)`,
              }}
            >
              {b.node}
            </div>
          );
        })}
      </div>
    </div>
  );
};
