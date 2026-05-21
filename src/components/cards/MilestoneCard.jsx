import { Flag } from "lucide-react";
import useStore from "../../store/useStore";
import Tag from "../common/Tag";
import { formatDate } from "../../lib/utils";

function MilestoneCard({ milestone }) {
  const dept = useStore((s) => s.getDepartment(milestone.departmentId));

  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center">
          <Flag size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {dept && <Tag tone="brand">{dept.name}</Tag>}
            <span className="text-xs muted">
              {formatDate(milestone.date, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <h3 className="mt-2 font-display font-bold text-base text-ink-900 dark:text-ink-100">
            {milestone.title}
          </h3>
          <p className="mt-1 text-sm muted">{milestone.body}</p>
        </div>
      </div>
    </div>
  );
}

export default MilestoneCard;
