import { Moon, Sun } from "lucide-react";
import useStore from "../../store/useStore";

function ThemeToggle({ className = "" }) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={
        "p-2 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800 transition " +
        className
      }
      aria-label="Toggle theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;
