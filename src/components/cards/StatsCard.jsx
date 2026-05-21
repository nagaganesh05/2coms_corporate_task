import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

function StatsCard({ title, value, delta, icon: Icon, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
    success: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
    accent: "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  };
  const positive = delta && !String(delta).trim().startsWith("-");

  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start justify-between">
        <p className="text-sm muted">{title}</p>
        {Icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              tones[tone] || tones.brand,
            )}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="font-display text-3xl font-bold mt-2 text-ink-900 dark:text-ink-100">
        {value}
      </p>
      {delta && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            positive
              ? "text-success-600 dark:text-success-500"
              : "text-danger-600 dark:text-danger-500",
          )}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}

export default StatsCard;
