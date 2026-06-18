import './index.css';
import './fonts';
import { Composition } from 'remotion';
import { KommandoDemo, KOMMANDO_DEMO_DURATION } from './KommandoDemo';
import { ShotAi } from './shots/ShotAi';
import { ShotPanes } from './shots/ShotPanes';
import { ShotCommands } from './shots/ShotCommands';
import { ShotMcp } from './shots/ShotMcp';
import { FPS } from './theme';

const SHOT_W = 1780;
const SHOT_H = 1100;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KommandoDemo"
        component={KommandoDemo}
        durationInFrames={KOMMANDO_DEMO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="ShotAi"
        component={ShotAi}
        durationInFrames={1}
        fps={FPS}
        width={SHOT_W}
        height={SHOT_H}
        defaultProps={{ width: SHOT_W, height: SHOT_H }}
      />
      <Composition
        id="ShotPanes"
        component={ShotPanes}
        durationInFrames={1}
        fps={FPS}
        width={SHOT_W}
        height={SHOT_H}
        defaultProps={{ width: SHOT_W, height: SHOT_H }}
      />
      <Composition
        id="ShotCommands"
        component={ShotCommands}
        durationInFrames={1}
        fps={FPS}
        width={SHOT_W}
        height={SHOT_H}
        defaultProps={{ width: SHOT_W, height: SHOT_H }}
      />
      <Composition
        id="ShotMcp"
        component={ShotMcp}
        durationInFrames={1}
        fps={FPS}
        width={SHOT_W}
        height={SHOT_H}
        defaultProps={{ width: SHOT_W, height: SHOT_H }}
      />
    </>
  );
};
