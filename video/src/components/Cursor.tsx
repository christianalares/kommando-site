import { useCurrentFrame } from 'remotion';
import { colors } from '../theme';

/** macOS-style arrow pointer at (x, y), with a press squash. */
export const Cursor: React.FC<{ x: number; y: number; press?: boolean }> = ({
  x,
  y,
  press = false,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 60,
      transform: `scale(${press ? 0.82 : 1})`,
      transformOrigin: '4px 3px',
      filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))',
      pointerEvents: 'none',
    }}
  >
    <svg width={30} height={30} viewBox="0 0 24 24">
      <path
        d="M5 2.5 L5 19.5 L9.2 15.6 L11.9 21.4 L14.6 20.2 L11.9 14.5 L17.5 14.5 Z"
        fill="#fff"
        stroke="#1a1a1a"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Expanding ring at (x, y) shortly after `clickFrame`. */
export const ClickRipple: React.FC<{
  x: number;
  y: number;
  clickFrame: number;
}> = ({ x, y, clickFrame }) => {
  const frame = useCurrentFrame();
  const t = frame - clickFrame;
  if (t < 0 || t > 14) {
    return null;
  }
  const p = t / 14;
  const size = 10 + p * 38;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        border: `2px solid ${colors.brand}`,
        opacity: (1 - p) * 0.8,
        zIndex: 55,
        pointerEvents: 'none',
      }}
    />
  );
};
