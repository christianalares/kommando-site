import { Check, ChevronDown, Plus } from 'lucide-react';
import { colors, fonts } from '../theme';

/**
 * Spaces are per-project workspaces (each the parent of its own tabs/panes).
 * Names + palette colors are picked to sit alongside the rest of the demo,
 * which all lives in the "acme" project under ~/dev.
 */
export type SpaceInfo = { name: string; color: string };

export const SPACES: Array<SpaceInfo> = [
  { name: 'Acme', color: '#4F8DFD' }, // blue — the app being built (active)
  { name: 'Dotfiles', color: '#BF5AF2' }, // purple
  { name: 'Infra', color: '#FF9F0A' }, // orange
];

/** The title-bar chip: a chevron + a rounded badge with the space's first letter. */
export const SpaceChip: React.FC<{ letter: string; color: string }> = ({
  letter,
  color,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <ChevronDown size={12} color={colors.muted} strokeWidth={3} />
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)',
      }}
    >
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 15,
          fontWeight: 700,
          color: '#fff',
        }}
      >
        {letter}
      </span>
    </div>
  </div>
)

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 14,
      height: 14,
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)',
      flexShrink: 0,
    }}
  />
)

/**
 * The Spaces popover. `highlightIndex` is the hovered/keyboard row (0…SPACES,
 * where the last index is the "New Space" row); `activeIndex` is the currently
 * selected space (gets the checkmark). `appear` (0–1) drives the entrance.
 */
export const SpacesPanel: React.FC<{
  highlightIndex: number
  activeIndex: number
  appear?: number
}> = ({ highlightIndex, activeIndex, appear = 1 }) => {
  const newSpaceIndex = SPACES.length
  return (
    <div
      style={{
        width: 344,
        transformOrigin: 'top left',
        transform: `translateY(${(1 - appear) * -8}px) scale(${0.97 + appear * 0.03})`,
        opacity: appear,
        backgroundColor: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        boxShadow:
          '0 30px 90px -20px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 600,
          color: colors.muted,
          padding: '4px 8px 2px',
        }}
      >
        Spaces
      </span>

      {SPACES.map((space, i) => {
        const isActive = i === activeIndex
        const isHighlighted = i === highlightIndex
        return (
          <div
            key={space.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              height: 40,
              padding: '0 10px',
              borderRadius: 8,
              backgroundColor: isHighlighted ? colors.brandGlowSoft : 'transparent',
            }}
          >
            <Dot color={space.color} />
            <span
              style={{
                fontFamily: fonts.sans,
                fontSize: 16,
                fontWeight: isActive ? 600 : 400,
                color: colors.fg,
                flex: 1,
                minWidth: 0,
              }}
            >
              {space.name}
            </span>
            {isActive ? (
              <Check size={17} color={colors.muted} strokeWidth={2.6} />
            ) : null}
          </div>
        )
      })}

      <div
        style={{
          height: 1,
          backgroundColor: colors.divider,
          margin: '4px 8px',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 40,
          padding: '0 10px',
          borderRadius: 8,
          backgroundColor:
            highlightIndex === newSpaceIndex ? colors.brandGlowSoft : 'transparent',
        }}
      >
        <span style={{ width: 14, display: 'flex', justifyContent: 'center' }}>
          <Plus size={15} color={colors.muted} strokeWidth={2.6} />
        </span>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: 16,
            color: colors.fg,
          }}
        >
          New Space
        </span>
      </div>
    </div>
  )
}
