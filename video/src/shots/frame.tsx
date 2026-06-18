/**
 * Style override that flattens the Kommando window into a full-bleed rectangle
 * for static showcase shots — the site's <Screenshot> wrapper adds its own
 * rounding, border and shadow, so we strip the window's here.
 */
export const flush: React.CSSProperties = {
  borderRadius: 0,
  border: 'none',
  boxShadow: 'none',
};
