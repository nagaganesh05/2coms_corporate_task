import { Flag } from "lucide-react";
import useStore from "../../store/useStore";
import SectionHeader from "../common/SectionHeader";
import Tag from "../common/Tag";
import { formatDate } from "../../lib/utils";

function MilestonesTimeline() {
  const milestones = useStore((s) => s.milestones);
  const getDepartment = useStore((s) => s.getDepartment);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={Flag}
        title="Key milestones"
        subtitle="What we have achieved together"
      />
      <ol className="relative pl-4">
        <span className="absolute top-0 bottom-0 left-1.5 w-px bg-ink-200 dark:bg-ink-700" />
        {milestones.map((m) => {
          const dept = getDepartment(m.departmentId);
          return (
            <li key={m.id} className="relative pb-5 last:pb-0">
              <span className="absolute -left-0 top-1.5 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-100 dark:ring-brand-500/20" />
              <div className="ml-5">
                <div className="flex items-center gap-2 flex-wrap">
                  {dept && <Tag tone="brand">{dept.name}</Tag>}
                  <span className="text-xs muted">
                    {formatDate(m.date, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="font-semibold mt-1 text-ink-900 dark:text-ink-100">
                  {m.title}
                </p>
                <p className="text-sm muted mt-0.5 line-clamp-2">{m.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default MilestonesTimeline;
