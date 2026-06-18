import { Plus, Sparkles } from 'lucide-react';
import { colors } from '../theme';

export const WindowToolbar: React.FC = () => {
  return (
    <>
      <Plus size={20} color={colors.muted} strokeWidth={2} />
      <Sparkles size={18} color={colors.muted} strokeWidth={2} />
    </>
  );
};
