import { useCurrentFrame } from 'remotion';
import { colors, FPS } from '../theme';

/**
 * Terminal block cursor that blinks on the timeline (no CSS animation,
 * which the Remotion renderer can't capture deterministically).
 */
export const BlockCursor: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  blink?: boolean;
  style?: React.CSSProperties;
}> = ({
  width = 9,
  height = 18,
  color = colors.fg,
  blink = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const period = Math.round(FPS * 1.06);
  const on = !blink || frame % period < period / 2;

  return (
    <span
      style={{
        display: 'inline-block',
        width,
        height,
        marginBottom: -3,
        marginLeft: 2,
        borderRadius: 1.5,
        backgroundColor: color,
        opacity: on ? 0.95 : 0,
        ...style,
      }}
    />
  );
};
