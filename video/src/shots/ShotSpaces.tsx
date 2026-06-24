import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { MONO_LH, MONO_SIZE, PromptLine } from '../components/terminal/parts';
import { LS_ENTRIES, LsRow } from '../components/terminal/ls';
import { SPACES, SpaceChip, SpacesPanel } from '../components/SpacesUI';
import { colors } from '../theme';
import { flush } from './frame';

/** Static showcase shot of the Spaces switcher open over the Acme workspace. */
export const ShotSpaces: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  return (
    <KommandoWindow
      width={width}
      height={height}
      style={flush}
      spaceChip={<SpaceChip letter="A" color={SPACES[0].color} />}
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

      {/* Spaces popover, dropped from the chip */}
      <div style={{ position: 'absolute', left: 40, top: 6 }}>
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: 2,
            width: 16,
            height: 16,
            backgroundColor: colors.panel,
            borderLeft: `1px solid ${colors.border}`,
            borderTop: `1px solid ${colors.border}`,
            transform: 'rotate(45deg)',
            borderTopLeftRadius: 3,
          }}
        />
        <SpacesPanel activeIndex={0} highlightIndex={0} />
      </div>
    </KommandoWindow>
  );
};
