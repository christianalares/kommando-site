import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

export const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700'],
});

export const jetBrains = loadJetBrains('normal', {
  weights: ['400', '500', '700'],
});
