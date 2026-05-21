import { cn } from "../../lib/utils";

const tones = {
  brand:
    "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  ink:
    "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
  success:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  warning:
    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  danger:
    "bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500",
  accent:
    "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300",
  ghost:
    "bg-transparent border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300",
};

function Tag({ children, tone = "ink", className = "", icon = null }) {
  return (
    <span className={cn("chip", tones[tone] || tones.ink, className)}>
      {icon}
      {children}
    </span>
  );
}

export default Tag;
