import { CalendarCheck2, ArrowRight, ChevronRight } from "lucide-react";
import useStore from "../../store/useStore";
import SectionHeader from "../common/SectionHeader";
import Tag from "../common/Tag";

function LeadershipMeetWidget() {
  const meets = useStore((s) => s.leadershipMeets);
  const latest = meets[0];
  if (!latest) return null;

  return (
    <div className="card p-5">
      <SectionHeader
        icon={CalendarCheck2}
        title="Monthly Leadership Meet"
        subtitle={latest.month}
      />
      <p className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">
        {latest.headline}
      </p>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-wider muted font-semibold">
          Outcomes
        </p>
        <ul className="mt-2 space-y-2">
          {latest.outcomes.map((o, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <ChevronRight size={14} className="mt-0.5 text-brand-600 shrink-0" />
              <span className="text-ink-700 dark:text-ink-300">{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {latest.nextSteps?.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-wider muted font-semibold">
            Next steps
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {latest.nextSteps.map((n, i) => (
              <Tag key={i} tone="ink">
                <ArrowRight size={10} /> {n}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadershipMeetWidget;
