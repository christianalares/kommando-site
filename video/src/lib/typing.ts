import { FPS } from '../theme';

/**
 * How many characters of `text` are visible at `frame`, starting at
 * `startFrame`, typed at `cps` characters per second.
 */
export const typedLength = (
  frame: number,
  startFrame: number,
  textLength: number,
  cps: number,
): number => {
  if (frame < startFrame) {
    return 0;
  }
  const elapsedSeconds = (frame - startFrame) / FPS;
  return Math.min(textLength, Math.floor(elapsedSeconds * cps));
};

export const typedSlice = (
  text: string,
  frame: number,
  startFrame: number,
  cps: number,
): string => {
  return text.slice(0, typedLength(frame, startFrame, text.length, cps));
};

/** Frame at which typing of `text` finishes. */
export const typingEndFrame = (
  startFrame: number,
  textLength: number,
  cps: number,
): number => {
  return startFrame + Math.ceil((textLength / cps) * FPS);
};
