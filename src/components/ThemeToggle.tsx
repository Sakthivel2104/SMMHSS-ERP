import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
