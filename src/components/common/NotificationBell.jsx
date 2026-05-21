import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/useStore";
import { timeAgo, cn } from "../../lib/utils";

function NotificationBell() {
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const markRead = useStore((s) => s.markNotificationRead);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-danger-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] card overflow-hidden z-50 animate-pop-in">
          <div className="p-3 flex items-center justify-between border-b border-ink-100 dark:border-ink-800">
            <p className="font-semibold">Notifications</p>
            <button
              onClick={markAllRead}
              className="text-xs text-brand-600 dark:text-brand-300 hover:underline flex items-center gap-1"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-ink-100 dark:divide-ink-800">
            {notifications.length === 0 && (
              <p className="text-sm muted p-6 text-center">You are all caught up.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "w-full text-left p-3 flex gap-3 items-start hover:bg-ink-50 dark:hover:bg-ink-800/60 transition",
                  !n.read && "bg-brand-50/40 dark:bg-brand-500/5",
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 w-2 h-2 rounded-full shrink-0",
                    n.read ? "bg-ink-300 dark:bg-ink-700" : "bg-brand-600",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-800 dark:text-ink-100">
                    {n.message}
                  </p>
                  <p className="text-xs muted mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center p-3 text-sm font-medium text-brand-600 dark:text-brand-300 border-t border-ink-100 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-800/60"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
