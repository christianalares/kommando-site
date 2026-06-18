import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { AppIcon } from '../components/Logo';
import { BlockCursor } from '../components/BlockCursor';
import { colors, fonts } from '../theme';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconIn = spring({ frame, fps, config: { damping: 16, mass: 0.8 } });
  const iconScale = 0.6 + iconIn * 0.4;

  const wordIn = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tagIn = interpolate(frame, [30, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <div style={{ transform: `scale(${iconScale})`, opacity: iconIn }}>
        <AppIcon size={150} />
      </div>

      <div
        style={{
          opacity: wordIn,
          transform: `translateY(${(1 - wordIn) * 14}px)`,
          display: 'flex',
          alignItems: 'baseline',
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: colors.fg,
          }}
        >
          Kommando
        </span>
        <BlockCursor width={34} height={70} color={colors.brand} />
      </div>

      <div
        style={{
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * 12}px)`,
          fontFamily: fonts.sans,
          fontSize: 30,
          color: colors.fgDim,
        }}
      >
        The terminal that thinks with you.
      </div>
    </AbsoluteFill>
  );
};
