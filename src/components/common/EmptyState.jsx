import { Inbox } from "lucide-react";

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  hint = "Once activity starts, you will see it here.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-2xl border border-dashed border-ink-200 dark:border-ink-700 bg-ink-50/40 dark:bg-ink-900/40">
      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 flex items-center justify-center text-ink-500 mb-3">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
      <p className="text-sm muted mt-1 max-w-sm">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
