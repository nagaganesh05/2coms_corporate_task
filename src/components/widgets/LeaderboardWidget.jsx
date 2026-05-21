import { Trophy, Medal } from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import SectionHeader from "../common/SectionHeader";

const RANK_BG = [
  "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
  "bg-gradient-to-r from-slate-300 to-slate-500 text-white",
  "bg-gradient-to-r from-amber-700 to-amber-800 text-white",
];

function LeaderboardWidget({ limit = 5 }) {
  const leaders = useStore((s) => s.getLeaderboard(limit));

  return (
    <div className="card p-5">
      <SectionHeader
        icon={Trophy}
        title="Recognition leaderboard"
        subtitle="Top contributors this cycle"
      />
      {leaders.length === 0 ? (
        <p className="text-sm muted">No recognitions yet.</p>
      ) : (
        <ol className="space-y-3">
          {leaders.map((row, i) => (
            <li
              key={row.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800/50"
            >
              <div
                className={
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold " +
                  (i < 3
                    ? RANK_BG[i]
                    : "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300")
                }
              >
                {i < 3 ? <Medal size={14} /> : i + 1}
              </div>
              <Avatar name={row.employee.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {row.employee.name}
                </p>
                <p className="text-xs muted truncate">{row.employee.role}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-base font-bold text-ink-900 dark:text-ink-100">
                  {row.points}
                </p>
                <p className="text-[10px] muted">{row.count} kudos</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default LeaderboardWidget;
