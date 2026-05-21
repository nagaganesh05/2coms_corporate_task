import { Quote, Pin } from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import SectionHeader from "../common/SectionHeader";
import { timeAgo } from "../../lib/utils";

function LeadershipMessageWidget() {
  const messages = useStore((s) => s.leadershipMessages);
  const getEmployee = useStore((s) => s.getEmployee);

  const top = [...messages].sort((a, b) => (b.pinned ? 1 : -1) - (a.pinned ? 1 : -1)).slice(0, 3);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={Quote}
        title="From Leadership"
        subtitle="Latest messages from the leadership team"
      />
      <div className="space-y-4">
        {top.map((m, idx) => {
          const author = getEmployee(m.authorId);
          return (
            <div
              key={m.id}
              className={
                "p-4 rounded-2xl border " +
                (idx === 0
                  ? "bg-brand-50/60 dark:bg-brand-500/10 border-brand-100 dark:border-brand-500/20"
                  : "border-ink-100 dark:border-ink-800")
              }
            >
              <div className="flex items-start gap-3">
                <Avatar name={author?.name} size="md" ring />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{author?.name}</p>
                    <span className="text-xs muted">·</span>
                    <span className="text-xs muted">{author?.role}</span>
                    {m.pinned && (
                      <Tag tone="brand" icon={<Pin size={10} />}>
                        Pinned
                      </Tag>
                    )}
                  </div>
                  <p className="font-display font-bold text-base mt-1 text-ink-900 dark:text-ink-100">
                    {m.title}
                  </p>
                  <p className="text-sm text-ink-700 dark:text-ink-300 mt-1 line-clamp-3">
                    {m.body}
                  </p>
                  <p className="text-[11px] muted mt-2">{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeadershipMessageWidget;
