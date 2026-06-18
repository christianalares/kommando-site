import {
  Check,
  Command as CommandIcon,
  Keyboard,
  Paintbrush,
  Plus,
  Sparkles,
  SquareTerminal,
  Trash2,
  X,
} from 'lucide-react';
import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { MONO_LH, MONO_SIZE, PromptLine } from '../components/terminal/parts';
import { LS_ENTRIES, LsRow } from '../components/terminal/ls';
import { Sans } from '../components/sidebar/parts';
import { colors, fonts, radius } from '../theme';
import { flush } from './frame';

const MODAL_W = 760;
const MODAL_H = 470;

const dot = (color: string): React.CSSProperties => ({
  width: 13,
  height: 13,
  borderRadius: '50%',
  backgroundColor: color,
});

const SettingsTab: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '8px 16px',
      borderRadius: 10,
      backgroundColor: active ? colors.brand : 'transparent',
      color: active ? '#fff' : colors.muted,
    }}
  >
    {icon}
    <Sans style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</Sans>
  </div>
);

const Field: React.FC<{
  value: string;
  mono?: boolean;
  left: number;
  top: number;
  width: number;
}> = ({ value, mono, left, top, width }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      borderRadius: 8,
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      fontFamily: mono ? fonts.mono : fonts.sans,
      fontSize: 14.5,
    }}
  >
    <span style={{ color: colors.fg }}>{value}</span>
  </div>
);

const Checkbox: React.FC<{ left: number; top: number }> = ({ left, top }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 18,
      height: 18,
      borderRadius: 5,
      backgroundColor: colors.brand,
      border: `1.5px solid ${colors.brand}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Check size={13} color="#fff" strokeWidth={3} />
  </div>
);

const ShortcutPill: React.FC<{ keys: string; left: number; top: number }> = ({
  keys,
  left,
  top,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 104,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: colors.surfaceStrong,
      border: `1.5px solid ${colors.border}`,
      fontFamily: fonts.mono,
      fontSize: 14,
      color: colors.fgDim,
    }}
  >
    {keys}
  </div>
);

const CommandRow: React.FC<{ name: string; cmd: string; keys: string; top: number }> = ({
  name,
  cmd,
  keys,
  top,
}) => (
  <>
    <Field value={name} left={28} top={top} width={232} />
    <Field value={cmd} mono left={276} top={top} width={330} />
    <Trash2 size={18} color={colors.muted} style={{ position: 'absolute', left: 628, top: top + 12 }} />
    <Checkbox left={28} top={top + 61} />
    <Sans style={{ position: 'absolute', left: 56, top: top + 60, fontSize: 14, color: colors.fgDim }}>
      Run immediately
    </Sans>
    <ShortcutPill keys={keys} left={508} top={top + 52} />
    <X size={17} color={colors.muted} style={{ position: 'absolute', left: 628, top: top + 61 }} />
  </>
);

/** Static showcase shot of the Commands settings panel with custom shortcuts. */
export const ShotCommands: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  return (
    <KommandoWindow
      width={width}
      height={height}
      style={flush}
      tabs={<Tab label="acme" />}
      toolbar={<WindowToolbar />}
    >
      {/* Terminal backdrop */}
      <div style={{ position: 'absolute', inset: 0, padding: '22px 26px' }}>
        <PromptLine command="ls -lSh" dirty={false} />
        <div style={{ marginTop: 4 }}>
          {LS_ENTRIES.map((entry, i) => (
            <div key={i} style={{ height: MONO_SIZE * MONO_LH }}>
              <LsRow entry={entry} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 6 }}>
          <PromptLine command="" cursor />
        </div>
      </div>

      {/* Dim */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: colors.scrim }} />

      {/* Modal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: MODAL_W,
            height: MODAL_H,
            borderRadius: radius.window,
            backgroundColor: colors.panel,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 40px 120px -20px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Titlebar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: `1px solid ${colors.divider}`,
            }}
          >
            <div style={{ position: 'absolute', left: 16, display: 'flex', gap: 8 }}>
              <span style={dot(colors.tlRed)} />
              <span style={dot(colors.tlYellow)} />
              <span style={dot(colors.tlGreen)} />
            </div>
            <Sans style={{ fontSize: 15, fontWeight: 600, color: colors.fg }}>
              Commands
            </Sans>
          </div>

          {/* Tabs */}
          <div
            style={{
              position: 'absolute',
              top: 58,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <SettingsTab icon={<Paintbrush size={20} />} label="Appearance" />
            <SettingsTab icon={<SquareTerminal size={20} />} label="Terminal" />
            <SettingsTab icon={<Keyboard size={20} />} label="Shortcuts" />
            <SettingsTab icon={<CommandIcon size={20} />} label="Commands" active />
            <SettingsTab icon={<Sparkles size={20} />} label="AI" />
          </div>

          <CommandRow name="List files" cmd="ls" keys="⌘L" top={140} />
          <CommandRow name="Clear" cmd="clear" keys="⌘K" top={262} />

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              left: 28,
              top: 392,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 9,
              backgroundColor: colors.surfaceStrong,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Plus size={16} color={colors.fgDim} />
            <Sans style={{ fontSize: 14, color: colors.fg }}>Add Command</Sans>
          </div>
        </div>
      </div>
    </KommandoWindow>
  );
};
