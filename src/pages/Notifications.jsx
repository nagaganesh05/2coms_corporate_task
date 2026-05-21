import { useState } from "react";
import { Bell, CheckCheck, Trophy, Megaphone, MessageCircle, Calendar } from "lucide-react";
import useStore from "../store/useStore";
import EmptyState from "../components/common/EmptyState";
import { timeAgo, cn } from "../lib/utils";

const ICON = {
  recognition: Trophy,
  comment: MessageCircle,
  event: Calendar,
  policy: Megaphone,
};

const TYPES = ["all", "recognition", "comment", "event", "policy"];

function Notifications() {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const [filter, setFilter] = useState("all");

  const list =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Notifications
          </h1>
          <p className="muted text-sm">Stay on top of activity across the company.</p>
        </div>
        <button onClick={markAllRead} className="btn-outline text-sm">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="card p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition",
              filter === t
                ? "bg-brand-600 text-white"
                : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Bell} title="You are all caught up" hint="New activity will show up here." />
      ) : (
        <div className="card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
          {list.map((n) => {
            const Icon = ICON[n.type] || Bell;
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full text-left p-4 flex gap-3 items-start hover:bg-ink-50 dark:hover:bg-ink-800/60 transition",
                  !n.read && "bg-brand-50/40 dark:bg-brand-500/5",
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-800 dark:text-ink-100">{n.message}</p>
                  <p className="text-xs muted mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
