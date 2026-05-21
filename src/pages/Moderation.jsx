import { useMemo, useState } from "react";
import {
  Shield,
  Check,
  X,
  Filter,
  AlertTriangle,
  MessageSquare,
  FileText,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import Tag from "../components/common/Tag";
import Avatar from "../components/common/Avatar";
import EmptyState from "../components/common/EmptyState";
import { cn, timeAgo } from "../lib/utils";

const TYPE_ICON = {
  post: FileText,
  comment: MessageSquare,
  forum: MessageSquare,
};

const STATUS_FILTERS = ["all", "pending", "flagged", "approved", "rejected"];

function Moderation() {
  const queue = useStore((s) => s.moderationQueue);
  const approve = useStore((s) => s.approveModeration);
  const reject = useStore((s) => s.rejectModeration);
  const getEmployee = useStore((s) => s.getEmployee);

  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () => (status === "all" ? queue : queue.filter((m) => m.status === status)),
    [queue, status],
  );

  const counts = useMemo(
    () =>
      STATUS_FILTERS.reduce((acc, s) => {
        acc[s] = s === "all" ? queue.length : queue.filter((m) => m.status === s).length;
        return acc;
      }, {}),
    [queue],
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Moderation queue
          </h1>
          <p className="muted text-sm">
            Keep the platform clean, kind and on-message.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tag tone="success" icon={<ShieldCheck size={12} />}>
            {counts.approved || 0} approved
          </Tag>
          <Tag tone="warning" icon={<ShieldAlert size={12} />}>
            {(counts.pending || 0) + (counts.flagged || 0)} need review
          </Tag>
        </div>
      </div>

      <div className="card p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Filter size={14} className="text-ink-400 ml-1 shrink-0" />
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition",
              status === s
                ? "bg-brand-600 text-white"
                : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
            )}
          >
            {s} <span className="opacity-70">· {counts[s] || 0}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Nothing to review"
          hint="The queue is clear. Great job, team."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const Icon = TYPE_ICON[m.type] || FileText;
            const author = getEmployee(m.authorId);
            const decided = m.status === "approved" || m.status === "rejected";
            return (
              <div key={m.id} className="card p-4 flex flex-col sm:flex-row gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    m.status === "flagged"
                      ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500"
                      : m.status === "rejected"
                        ? "bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500"
                        : m.status === "approved"
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                          : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
                  )}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-ink-900 dark:text-ink-100">
                      {m.title}
                    </p>
                    <Tag
                      tone={
                        m.status === "flagged"
                          ? "warning"
                          : m.status === "approved"
                            ? "success"
                            : m.status === "rejected"
                              ? "danger"
                              : "brand"
                      }
                      className="capitalize"
                    >
                      {m.status}
                    </Tag>
                    <Tag tone="ghost" className="capitalize">
                      {m.type}
                    </Tag>
                  </div>
                  <p className="text-sm muted mt-1">{m.body}</p>
                  {m.reason && (
                    <p className="text-xs text-warning-600 mt-2 inline-flex items-center gap-1.5">
                      <AlertTriangle size={12} /> {m.reason}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs muted">
                    {author && (
                      <span className="inline-flex items-center gap-1.5">
                        <Avatar name={author.name} size="xs" />
                        {author.name}
                      </span>
                    )}
                    <span>·</span>
                    <span>{timeAgo(m.createdAt)}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => {
                      approve(m.id);
                      toast.success("Approved");
                    }}
                    disabled={decided}
                    className="btn !bg-success-500 hover:!bg-success-600 text-white text-sm disabled:opacity-50"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => {
                      reject(m.id);
                      toast.success("Rejected");
                    }}
                    disabled={decided}
                    className="btn !bg-danger-500 hover:!bg-danger-600 text-white text-sm disabled:opacity-50"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Moderation;
