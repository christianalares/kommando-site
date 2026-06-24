import { KommandoWindow, Tab } from '../components/Window';
import { WindowToolbar } from '../components/Toolbar';
import { CommandBlocksTerminal } from '../components/CommandBlocksTerminal';
import { flush } from './frame';

/** Static showcase shot: a past command block selected, with the "Copied" pill. */
export const ShotCommandBlocks: React.FC<{ width: number; height: number }> = ({
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
      <CommandBlocksTerminal selected={0} copied />
    </KommandoWindow>
  );
};
