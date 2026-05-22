import { BarChart2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import useStore from "../../store/useStore";
import SectionHeader from "../common/SectionHeader";
import { cn, formatDate } from "../../lib/utils";

function PollWidget() {
  const polls = useStore((s) => s.polls);
  const votePoll = useStore((s) => s.votePoll);
  const poll = polls[0];
  if (!poll) return null;

  const totalVotes = poll.options.reduce((a, o) => a + o.votes, 0);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={BarChart2}
        title="Pulse poll"
        subtitle={`Closes ${formatDate(poll.closesAt, {
          day: "numeric",
          month: "short",
        })}`}
      />
      <p className="font-display text-base font-bold text-ink-900 dark:text-ink-100">
        {poll.question}
      </p>
      <div className="mt-4 space-y-2.5">
        {poll.options.map((o) => {
          const pct = totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0;
          const isMyVote = poll.voted === o.id;
          return (
            <button
              key={o.id}
              onClick={() => votePoll(poll.id, o.id)}
              disabled={!!poll.voted}
              className={cn(
                "relative w-full text-left p-3 rounded-xl border transition overflow-hidden",
                isMyVote
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                  : "border-ink-200 dark:border-ink-700 hover:border-brand-300 dark:hover:border-brand-500/50",
                !poll.voted && "cursor-pointer",
                poll.voted && !isMyVote && "opacity-90",
              )}
            >
              {poll.voted && (
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "absolute inset-y-0 left-0",
                    isMyVote
                      ? "bg-brand-500/15"
                      : "bg-ink-100 dark:bg-ink-800",
                  )}
                />
              )}
              <div className="relative flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  {isMyVote && <CheckCircle2 size={14} className="text-brand-600" />}
                  {o.text}
                </span>
                {poll.voted && (
                  <span className="text-xs font-semibold tabular-nums">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs muted mt-3">
        {totalVotes.toLocaleString()} responses
        {poll.voted ? " · Thank you for voting" : ""}
      </p>
    </div>
  );
}

export default PollWidget;
