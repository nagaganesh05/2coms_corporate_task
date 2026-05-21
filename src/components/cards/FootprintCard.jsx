import { TrendingUp } from "lucide-react";
import useStore from "../../store/useStore";
import { cn } from "../../lib/utils";

function FootprintCard({ footprint }) {
  const dept = useStore((s) => s.getDepartment(footprint.departmentId));
  const vertical = useStore((s) => s.getVertical(dept?.verticalId));

  return (
    <div className="card overflow-hidden card-hover">
      <div className={cn("h-1.5 bg-gradient-to-r", vertical?.color || "from-brand-500 to-violet-500")} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            {dept?.name}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-500 font-medium">
            <TrendingUp size={12} /> {footprint.delta}
          </span>
        </div>
        <p className="font-display text-2xl font-bold mt-2 text-ink-900 dark:text-ink-100">
          {footprint.impact}
        </p>
        <p className="text-sm muted mt-1">{footprint.blurb}</p>
      </div>
    </div>
  );
}

export default FootprintCard;
