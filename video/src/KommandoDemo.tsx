import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';

import { Columns2, Plug, Sparkles, SquareSlash } from 'lucide-react';
import { Desktop } from './components/Desktop';
import { FeatureTitleCard } from './components/FeatureTitleCard';
import { Intro } from './scenes/Intro';
import { SceneExplain } from './scenes/SceneExplain';
import { ScenePanes } from './scenes/ScenePanes';
import { SceneMcp } from './scenes/SceneMcp';
import { SceneSettings } from './scenes/SceneSettings';
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
 * Hosts a window scene. When `tilt` is set it gives the window a tasteful 3D
 * glass tilt that slowly drifts across the scene; otherwise the window sits
 * flat and straight-on (used for the reading-heavy scenes).
 */
const WindowStage: React.FC<{
  tilt?: boolean;
  children: React.ReactNode;
}> = ({ tilt = false, children }) => {
  const frame = useCurrentFrame();
  // Flat scenes render at native 1:1 scale (no transform). Scaling the window
  // would put the smoothly-scrolling text on fractional pixels every frame,
  // which re-anti-aliases the glyphs and reads as flicker.
  let transform = 'none';
  if (tilt) {
    const ry = interpolate(frame, [0, 150], [-9, -3.5], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const rx = interpolate(frame, [0, 150], [5.5, 2.2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    transform = `perspective(1900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(0.9)`;
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

const D = {
  intro: 70,
  explain: 205,
  panes: 112,
  mcp: 326,
  settings: 210,
  outro: 130,
};

// Length of the "in your face" title card that announces each feature. The
// feature scene itself is offset by this so the card clears to reveal it.
const INTRO = 40;

const T = 16;
const timing = springTiming({
  config: { damping: 200, mass: 0.6 },
  durationInFrames: T,
});

export const KOMMANDO_DEMO_DURATION =
  D.intro +
  D.explain +
  D.panes +
  D.mcp +
  D.settings +
  D.outro +
  4 * INTRO -
  5 * T;

export const KommandoDemo: React.FC = () => {
  const fade = 18;
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile('soundtrack.mp3')}
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
          timing={timing}
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
          presentation={slide({ direction: 'from-right' })}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.panes}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage tilt>
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
          presentation={slide({ direction: 'from-right' })}
          timing={timing}
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
          presentation={slide({ direction: 'from-left' })}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={INTRO + D.settings}>
          <AbsoluteFill>
            <Sequence from={INTRO}>
              <WindowStage>
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
          presentation={slide({ direction: 'from-right' })}
          timing={timing}
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
