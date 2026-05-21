import { cn } from "../../lib/utils";

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className = "",
}) {
  return (
    <div className={cn("flex items-end justify-between mb-4", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
