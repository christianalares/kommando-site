import { Img, staticFile } from 'remotion';
import { colors } from '../theme';

export const AppIcon: React.FC<{ size: number; glow?: boolean }> = ({
  size,
  glow = true,
}) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    {glow ? (
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.25,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.brandGlow}, transparent 65%)`,
        }}
      />
    ) : null}
    <Img
      src={staticFile('kommando-icon.webp')}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size * 0.22,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    />
  </div>
);
