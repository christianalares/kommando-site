import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, themeName } from '../theme';

const isLight = themeName === 'light';

/**
 * Punchy full-frame title card shown at the start of a feature sequence:
 * it slams in over a dark blur, holds, then clears to reveal the feature
 * underneath. `intro` is the frame at which it begins exiting.
 */
export const FeatureTitleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  intro: number;
  accent?: string;
}> = ({ icon, title, subtitle, intro, accent = colors.brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame > intro + 14) {
    return null;
  }

  const inP = spring({ frame, fps, config: { damping: 16, mass: 0.6 } });
  const outP = interpolate(frame, [intro, intro + 13], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const backdrop = interpolate(
    frame,
    [0, 9, intro, intro + 13],
    [0, 0.78, 0.78, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const opacity = inP * (1 - outP);
  const scale = 0.86 + inP * 0.14 + outP * 0.08;
  const y = Math.round((1 - inP) * 26 - outP * 22);
  const barW = interpolate(inP, [0.2, 1], [0, 132], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isLight
          ? `rgba(231,234,240,${backdrop})`
          : `rgba(8,9,12,${backdrop})`,
        backdropFilter: `blur(${Math.round(backdrop * 16)}px)`,
        WebkitBackdropFilter: `blur(${Math.round(backdrop * 16)}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: `linear-gradient(150deg, ${accent}, rgba(255,255,255,0.06))`,
            border: `1px solid ${accent}`,
            boxShadow: `0 24px 80px -10px ${colors.brandGlow}`,
          }}
        >
          {icon}
        </div>
        <div style={{ height: 4, width: barW, borderRadius: 999, backgroundColor: accent }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: colors.fg,
              textShadow: isLight
                ? '0 2px 24px rgba(255,255,255,0.6)'
                : '0 6px 40px rgba(0,0,0,0.6)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 25,
              color: colors.fgDim,
              textShadow: isLight
                ? '0 1px 12px rgba(255,255,255,0.6)'
                : '0 2px 16px rgba(0,0,0,0.6)',
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
