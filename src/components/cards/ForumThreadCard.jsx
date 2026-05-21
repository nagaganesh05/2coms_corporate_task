import { MessageSquare, Heart, Flag, AlertTriangle } from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import { timeAgo, cn } from "../../lib/utils";

function ForumThreadCard({ thread, onOpen }) {
  const author = useStore((s) => s.getEmployee(thread.authorId));
  const dept = useStore((s) => s.getDepartment(thread.departmentId));
  const likeThread = useStore((s) => s.likeThread);
  const flagThread = useStore((s) => s.flagThread);

  return (
    <div
      className={cn(
        "card p-5 card-hover cursor-pointer",
        thread.flagged && "ring-1 ring-warning-500/40",
      )}
      onClick={() => onOpen?.(thread)}
    >
      <div className="flex items-start gap-3">
        <Avatar name={author?.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">{author?.name}</p>
            <span className="text-xs muted">·</span>
            <span className="text-xs muted">{dept?.name}</span>
            <span className="text-xs muted">·</span>
            <span className="text-xs muted">{timeAgo(thread.createdAt)}</span>
            {thread.flagged && (
              <Tag tone="warning" icon={<AlertTriangle size={10} />}>
                Flagged
              </Tag>
            )}
          </div>
          <h3 className="mt-2 font-display font-bold text-base text-ink-900 dark:text-ink-100">
            {thread.title}
          </h3>
          <p className="mt-1 text-sm muted line-clamp-2">{thread.body}</p>
          {thread.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {thread.tags.map((t) => (
                <Tag key={t} tone="ghost">
                  #{t}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center gap-3 text-xs muted">
        <button
          onClick={(e) => {
            e.stopPropagation();
            likeThread(thread.id);
          }}
          className="inline-flex items-center gap-1.5 hover:text-rose-600"
        >
          <Heart size={12} /> {thread.likes || 0}
        </button>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare size={12} /> {thread.replies?.length || 0} replies
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            flagThread(thread.id);
          }}
          className="ml-auto inline-flex items-center gap-1.5 hover:text-warning-600"
          title="Report"
        >
          <Flag size={12} />
        </button>
      </div>
    </div>
  );
}

export default ForumThreadCard;
