import { colors, fonts } from '../theme';

const KeyCap: React.FC<{ label: string; pressed?: boolean }> = ({
  label,
  pressed,
}) => (
  <div
    style={{
      minWidth: 76,
      height: 76,
      padding: '0 20px',
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fonts.sans,
      fontSize: 34,
      fontWeight: 600,
      color: pressed ? '#fff' : colors.fg,
      backgroundColor: pressed ? colors.brand : colors.panel,
      border: `1.5px solid ${pressed ? colors.brand : colors.border}`,
      boxShadow: pressed
        ? `0 10px 40px ${colors.brandGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`
        : '0 12px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}
  >
    {label}
  </div>
);

/** Floating ⌘K keystroke HUD. `progress` (0–1) drives scale/opacity. */
export const KeystrokeOverlay: React.FC<{
  progress: number;
  pressed?: boolean;
}> = ({ progress, pressed }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 70,
      display: 'flex',
      justifyContent: 'center',
      opacity: progress,
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: 14,
        transform: `scale(${0.75 + progress * 0.25})`,
      }}
    >
      <KeyCap label="⌘" pressed={pressed} />
      <KeyCap label="K" pressed={pressed} />
    </div>
  </div>
);
