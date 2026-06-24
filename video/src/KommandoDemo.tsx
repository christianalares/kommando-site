import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';

import {
  Blocks,
  Columns2,
  LayoutGrid,
  Palette,
  Plug,
  Sparkles,
  SquareSlash,
} from 'lucide-react';
import { Desktop } from './components/Desktop';
import { FeatureTitleCard } from './components/FeatureTitleCard';
import { Intro } from './scenes/Intro';
import { SceneExplain } from './scenes/SceneExplain';
import { SceneCommandBlocks } from './scenes/SceneCommandBlocks';
import { ScenePanes } from './scenes/ScenePanes';
import { SceneSpaces } from './scenes/SceneSpaces';
import { SceneMcp } from './scenes/SceneMcp';
import { SceneSettings } from './scenes/SceneSettings';
import { SceneThemeStudio } from './scenes/SceneThemeStudio';
import { Outro } from './scenes/Outro';
import { colors } from './theme';

export const WINDOW_W = 1780;
export const WINDOW_H = 968;
export const SIDEBAR_W = 560;

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </AbsoluteFill>
);

/**
 * How a window scene is staged:
 *  - `flat`   sits straight-on at native 1:1 (reading-heavy scenes — scaling
 *             smoothly-scrolling text onto fractional pixels every frame
 *             re-anti-aliases the glyphs and reads as flicker).
 *  - `drift`  the signature continuous 3D glass tilt that slowly settles.
 *  - the rest are entrance moves: the window skews/pushes in from an angle
 *             and settles to a crisp, flat 1:1 by ~frame 30, so the reading
 *             portion stays sharp while the entrance still has flare.
 */
type Camera = 'flat' | 'drift' | 'tiltL' | 'tiltR' | 'rise' | 'pushIn';

const ENTER = 44;

const ENTER_FROM: Record<
  Exclude<Camera, 'flat' | 'drift'>,
  { ry: number; rx: number; tx: number; ty: number; s: number }
> = {
  tiltL: { ry: 24, rx: 2, tx: -110, ty: 0, s: 0.88 },
  tiltR: { ry: -24, rx: 2, tx: 110, ty: 0, s: 0.88 },
  rise: { ry: 0, rx: 15, tx: 0, ty: 120, s: 0.9 },
  pushIn: { ry: 0, rx: -8, tx: 0, ty: -36, s: 0.78 },
};

const WindowStage: React.FC<{
  camera?: Camera;
  children: React.ReactNode;
}> = ({ camera = 'flat', children }) => {
  const frame = useCurrentFrame();
  let transform = 'none';

  if (camera === 'drift') {
    const ry = interpolate(frame, [0, 150], [-9, -3.5], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const rx = interpolate(frame, [0, 150], [5.5, 2.2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    transform = `perspective(1900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(0.9)`;
  } else if (camera !== 'flat') {
    const p = interpolate(frame, [0, ENTER], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    });
    const a = ENTER_FROM[camera];
    const ry = a.ry * (1 - p);
    const rx = a.rx * (1 - p);
    const tx = a.tx * (1 - p);
    const ty = a.ty * (1 - p);
    const s = a.s + (1 - a.s) * p;
    transform = `perspective(2000px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`;
  }

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 22,
      }}
    >
      <div style={{ transform, transformStyle: 'preserve-3d' }}>{children}</div>
    </AbsoluteFill>
  );
};

// Durations are tuned so the timeline lines up with soundtrack-2.mp3 (≈62.8s):
// the Outro ("Bring Kommando to your Mac") lands at exactly 00:56 (frame 1680,
// where the final note punches in) and the last screen then holds until the
// track runs out at ≈frame 1884.
const D = {
  intro: 70,
  explain: 233,
  commandBlocks: 168,
  panes: 118,
  spaces: 164,
  mcp: 360,
  settings: 228,
  theme: 205,
  outro: 204,
};

// Length of the "in your face" title card that announces each feature. The
// feature scene itself is offset by this so the card clears to reveal it.
const INTRO = 40;

// Two transition feels: a snappy spring for slides/wipes and a slightly longer,
// heavier glide for the 3D flips and the clock wipe so they read clearly.
const T_SNAP = 16;
const T_GLIDE = 22;
const snap = springTiming({
  config: { damping: 200, mass: 0.6 },
  durationInFrames: T_SNAP,
});
const glide = springTiming({
  config: { damping: 200, mass: 0.95 },
  durationInFrames: T_GLIDE,
});

// Overlap each transition steals from the timeline. 5 snappy + 3 glide gaps.
const TRANSITION_FRAMES = 5 * T_SNAP + 3 * T_GLIDE;

export const KOMMANDO_DEMO_DURATION =
  D.intro +
  D.explain +
  D.commandBlocks +
  D.panes +
  D.spaces +
  D.mcp +
  D.settings +
  D.theme +
  D.outro +
  7 * INTRO -
  TRANSITION_FRAMES;

export const KommandoDemo: React.FC = () => {
  const fade = 18;
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile('soundtrack-2.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, fade, KOMMANDO_DEMO_DURATION - fade, KOMMANDO_DEMO_DURATION],
            [0, 1, 1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />
      <Desktop />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.intro}>
          <Stage>
            <Intro />
          </Stage>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={snap}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.explain}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage>
                <SceneExplain
                  width={WINDOW_W}
                  height={WINDOW_H}
                  sidebarWidth={SIDEBAR_W}
                />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<Sparkles size={44} strokeWidth={2.1} />}
              title="Built-in AI"
              subtitle="Ask about your project — it runs the commands for you"
              intro={INTRO}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-bottom-right' })}
          timing={snap}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.commandBlocks}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage camera="tiltR">
                <SceneCommandBlocks width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<Blocks size={44} strokeWidth={2.1} />}
              title="Command blocks"
              subtitle="Click any past command — ⌘C copies it and its output"
              intro={INTRO}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: 'from-right', perspective: 2400 })}
          timing={glide}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.panes}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage camera="drift">
                <ScenePanes width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<Columns2 size={44} strokeWidth={2.1} />}
              title="Tabs & split panes"
              subtitle="Drag, drop and rearrange your whole workspace"
              intro={INTRO}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={snap}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.spaces}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage camera="tiltL">
                <SceneSpaces width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<LayoutGrid size={44} strokeWidth={2.1} />}
              title="Spaces"
              subtitle="A workspace per project — switch in a keystroke"
              intro={INTRO}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1920, height: 1080 })}
          timing={glide}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.mcp}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage>
                <SceneMcp width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<Plug size={44} strokeWidth={2.1} />}
              title="Built-in MCP server"
              subtitle="Let other AI tools drive your terminal"
              intro={INTRO}
              accent={colors.violet}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-left' })}
          timing={snap}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.settings}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage camera="rise">
                <SceneSettings width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<SquareSlash size={44} strokeWidth={2.1} />}
              title="Custom commands"
              subtitle="Bind any command to a keyboard shortcut"
              intro={INTRO}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: 'from-bottom', perspective: 2400 })}
          timing={glide}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.theme}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage camera="pushIn">
                <SceneThemeStudio width={WINDOW_W} height={WINDOW_H} />
              </WindowStage>
            </Sequence>
            <FeatureTitleCard
              icon={<Palette size={44} strokeWidth={2.1} />}
              title="Theme Studio"
              subtitle="Craft your own terminal colors — light and dark"
              intro={INTRO}
              accent="#54E0A6"
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={snap}
        />

        <TransitionSeries.Sequence durationInFrames={D.outro}>
          <Stage>
            <Outro />
          </Stage>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
