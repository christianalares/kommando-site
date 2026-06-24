import { ThemeStudio } from '../components/ThemeStudio';
import { AURORA_DARK, AURORA_LIGHT } from '../data/aurora';
import { themeName } from '../theme';
import { flush } from './frame';

/** Static showcase shot: the Theme Studio with the finished Aurora theme. */
export const ShotTheme: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const palette = themeName === 'light' ? AURORA_LIGHT : AURORA_DARK;
  return (
    <ThemeStudio
      width={width}
      height={height}
      palette={palette}
      name="Aurora"
      editingLight={themeName === 'light'}
      style={flush}
    />
  );
};
