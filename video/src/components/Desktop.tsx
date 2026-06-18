import { AbsoluteFill } from 'remotion';
import { colors } from '../theme';

/**
 * The "desktop" the Kommando window floats on. A deep blue-black gradient
 * with brand glows + a faint grid, echoing the marketing site's hero.
 */
export const Desktop: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% -10%, ${colors.desktopTop} 0%, ${colors.desktopMid} 45%, ${colors.desktopBottom} 100%)`,
      }}
    >
      {/* Brand glows */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46rem 46rem at 50% -14rem, ${colors.brandGlow}, transparent 60%)`,
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(34rem 34rem at 110% 120%, ${colors.brandGlowSoft}, transparent 60%)`,
        }}
      />
      {/* Faint grid, masked toward the top like the site */}
      <AbsoluteFill
        style={{
          opacity: 0.6,
          backgroundImage: `linear-gradient(to right, ${colors.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${colors.gridLine} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 85% 60% at 50% 0%, #000 55%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 60% at 50% 0%, #000 55%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
