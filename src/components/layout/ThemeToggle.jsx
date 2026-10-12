import { Moon, Sun } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

/**
 * ThemeToggle — Accessible light/dark theme switch.
 *
 * Uses Lucide Sun/Moon icons. The transition feels immediate
 * and controlled — no elaborate spinning or flashing.
 */
export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={onToggle}
      variant="ghost"
      size="md"
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.75} />
      ) : (
        <Moon size={18} strokeWidth={1.75} />
      )}
    </IconButton>
  );
}

