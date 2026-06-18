import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AppIcon } from '../components/Logo';
import { AppleLogo } from '../components/AppleLogo';
import { colors, fonts } from '../theme';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconIn = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const headIn = interpolate(frame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaIn = spring({
    frame: frame - 24,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const subIn = interpolate(frame, [40, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      <div style={{ transform: `scale(${0.7 + iconIn * 0.3})`, opacity: iconIn }}>
        <AppIcon size={132} />
      </div>

      <div
        style={{
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 12}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: colors.fg,
          }}
        >
          Bring Kommando to your Mac.
        </div>
      </div>

      <div
        style={{
          opacity: ctaIn,
          transform: `scale(${0.9 + ctaIn * 0.1})`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 30px',
          borderRadius: 999,
          backgroundColor: colors.brand,
          boxShadow: `0 16px 50px ${colors.brandGlow}`,
        }}
      >
        <AppleLogo size={24} />
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: 23,
            fontWeight: 600,
            color: '#fff',
          }}
        >
          Download for macOS
        </span>
      </div>

      <div
        style={{
          opacity: subIn,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 22,
            fontWeight: 500,
            color: colors.brandSoft,
          }}
        >
          kommando.app
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 16,
            color: colors.muted,
          }}
        >
          Free · macOS 26+ · Apple silicon
        </span>
      </div>
    </AbsoluteFill>
  );
};
