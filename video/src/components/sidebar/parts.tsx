import {
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronsUpDown,
  ScrollText,
  SquareArrowOutUpRight,
  Sparkles,
  TerminalSquare,
  Zap,
} from 'lucide-react';
import { colors, fonts, radius } from '../../theme';

export const Sans: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span style={{ fontFamily: fonts.sans, ...style }}>{children}</span>
);

export const AiSidebarHeader: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
      }}
    >
      <Sparkles size={18} color={colors.brand} strokeWidth={2.2} />
      <Sans style={{ fontSize: 16, fontWeight: 600, color: colors.fg }}>
        Assistant
      </Sans>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          maxWidth: 230,
          padding: '5px 9px',
          borderRadius: 8,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <ChevronsUpDown size={13} color={colors.muted} />
        <Sans
          style={{
            fontSize: 13,
            color: colors.fgDim,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Sans>
      </div>
      <SquareArrowOutUpRight size={16} color={colors.muted} />
    </div>
  );
};

export const UserPill: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', ...style }}>
      <div
        style={{
          maxWidth: '78%',
          padding: '9px 15px',
          borderRadius: radius.pill,
          backgroundColor: colors.brand,
          boxShadow: `0 6px 18px ${colors.brandGlow}`,
        }}
      >
        <Sans style={{ fontSize: 15.5, fontWeight: 500, color: '#fff' }}>
          {text}
        </Sans>
      </div>
    </div>
  );
};

export const ToolCard: React.FC<{
  kind: 'insert' | 'read';
  label: string;
  style?: React.CSSProperties;
}> = ({ kind, label, style }) => {
  const Icon = kind === 'insert' ? TerminalSquare : ScrollText;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderRadius: radius.card,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        ...style,
      }}
    >
      <ChevronRight size={16} color={colors.muted} />
      <Icon size={17} color={colors.fgDim} strokeWidth={2} />
      <Sans style={{ fontSize: 14.5, color: colors.fg, flex: 1 }}>{label}</Sans>
      <CheckCircle2 size={19} color={colors.checkGreen} strokeWidth={2.2} />
    </div>
  );
};

export const AutoRunRow: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          backgroundColor: colors.brand,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Check size={13} color="#fff" strokeWidth={3} />
      </div>
      <Zap size={14} color={colors.brand} strokeWidth={2.4} />
      <Sans style={{ fontSize: 13.5, color: colors.fgDim }}>
        Auto-run generated commands
      </Sans>
    </div>
  );
};

export const SidebarInput: React.FC<{
  value?: string;
  cursor?: boolean;
  active?: boolean;
}> = ({ value = '', cursor = false, active = false }) => {
  const hasValue = value.length > 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 8px 0 16px',
        borderRadius: 12,
        backgroundColor: colors.surface,
        border: `1px solid ${active ? colors.brand : colors.border}`,
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Sans
          style={{
            fontSize: 15,
            color: hasValue ? colors.fg : colors.muted,
          }}
        >
          {hasValue ? value : 'Ask about this tab…'}
        </Sans>
        {cursor ? (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 18,
              marginLeft: 1,
              backgroundColor: colors.brand,
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          backgroundColor: hasValue ? colors.brand : colors.surfaceStrong,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowUp
          size={18}
          color={hasValue ? '#fff' : colors.muted}
          strokeWidth={2.6}
        />
      </div>
    </div>
  );
};
