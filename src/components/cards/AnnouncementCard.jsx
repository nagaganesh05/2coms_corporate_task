import { Megaphone, AlertTriangle, Info } from "lucide-react";
import { cn, timeAgo } from "../../lib/utils";
import Tag from "../common/Tag";

const TONE = {
  high: {
    bar: "from-danger-500 to-rose-500",
    chip: "danger",
    icon: AlertTriangle,
    label: "Important",
  },
  medium: {
    bar: "from-brand-500 to-violet-500",
    chip: "brand",
    icon: Megaphone,
    label: "Announcement",
  },
  low: {
    bar: "from-ink-300 to-ink-400",
    chip: "ink",
    icon: Info,
    label: "FYI",
  },
};

function AnnouncementCard({
  title,
  description,
  priority = "medium",
  createdAt,
  cta,
}) {
  const t = TONE[priority] || TONE.medium;
  const Icon = t.icon;

  return (
    <div className="card overflow-hidden flex">
      <div className={cn("w-1.5 bg-gradient-to-b", t.bar)} />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-ink-200">
              <Icon size={14} />
            </div>
            <Tag tone={t.chip}>{t.label}</Tag>
          </div>
          {createdAt && (
            <span className="text-xs muted">{timeAgo(createdAt)}</span>
          )}
        </div>
        <h3 className="mt-3 font-display font-bold text-base text-ink-900 dark:text-ink-100">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-300">
            {description}
          </p>
        )}
        {cta && <div className="mt-4">{cta}</div>}
      </div>
    </div>
  );
}

export default AnnouncementCard;
