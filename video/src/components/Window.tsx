import { SquareTerminal, X } from 'lucide-react';
import { colors, fonts, radius } from '../theme';

const TITLEBAR_H = 50;

const TrafficLights: React.FC = () => {
  const dot = (color: string): React.CSSProperties => ({
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
  });
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
      <span style={dot(colors.tlRed)} />
      <span style={dot(colors.tlYellow)} />
      <span style={dot(colors.tlGreen)} />
    </div>
  );
};

export const Tab: React.FC<{ label: string; active?: boolean }> = ({
  label,
  active = true,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        height: 34,
        padding: '0 12px',
        borderRadius: 9,
        fontFamily: fonts.sans,
        fontSize: 16,
        fontWeight: 500,
        color: active ? colors.fg : colors.muted,
        backgroundColor: active ? colors.surfaceStrong : 'transparent',
        border: `1px solid ${active ? colors.border : 'transparent'}`,
      }}
    >
      <SquareTerminal size={16} color={colors.brandSoft} strokeWidth={2} />
      <span>{label}</span>
      <X size={15} color={colors.muted} strokeWidth={2.2} />
    </div>
  );
};

/**
 * The Kommando window frame: translucent rounded chrome, a unified titlebar
 * (traffic lights + tabs + toolbar on the left zone, optional sidebar header
 * on the right zone) and a body split into a left area + optional right panel.
 */
export const KommandoWindow: React.FC<{
  width: number;
  height: number;
  tabs?: React.ReactNode;
  toolbar?: React.ReactNode;
  rightWidth?: number;
  rightHeader?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  width,
  height,
  tabs,
  toolbar,
  rightWidth = 0,
  rightHeader,
  right,
  children,
  style,
}) => {
  const hasRight = rightWidth > 0;
  const leftWidth = width - rightWidth;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius.window,
        overflow: 'hidden',
        backgroundColor: colors.windowBg,
        backdropFilter: 'blur(34px)',
        WebkitBackdropFilter: 'blur(34px)',
        border: `1px solid ${colors.border}`,
        boxShadow:
          '0 40px 120px -20px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...style,
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: 'flex',
          height: TITLEBAR_H,
          flexShrink: 0,
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        <div
          style={{
            width: leftWidth,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 14px 0 20px',
          }}
        >
          <TrafficLights />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {tabs}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {toolbar}
          </div>
        </div>
        {hasRight ? (
          <div
            style={{
              width: rightWidth,
              borderLeft: `1px solid ${colors.divider}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
            }}
          >
            {rightHeader}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ width: leftWidth, position: 'relative', minWidth: 0 }}>
          {children}
        </div>
        {hasRight ? (
          <div
            style={{
              width: rightWidth,
              borderLeft: `1px solid ${colors.divider}`,
              backgroundColor: colors.sidebarBg,
              position: 'relative',
              minWidth: 0,
            }}
          >
            {right}
          </div>
        ) : null}
      </div>
    </div>
  );
};
