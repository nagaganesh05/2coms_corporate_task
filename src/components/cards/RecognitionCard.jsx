import { Award } from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import { timeAgo } from "../../lib/utils";

function RecognitionCard({ recognition, compact = false }) {
  const from = useStore((s) => s.getEmployee(recognition.fromId));
  const to = useStore((s) => s.getEmployee(recognition.toId));
  const badge = useStore((s) => s.getBadge(recognition.badgeId));

  if (compact) {
    return (
      <div className="card p-4 flex items-center gap-3 card-hover">
        <div className="text-2xl">{badge?.emoji || "🏅"}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold">{from?.name}</span>{" "}
            <span className="muted">recognized</span>{" "}
            <span className="font-semibold">{to?.name}</span>
          </p>
          <p className="text-xs muted truncate">{recognition.message}</p>
        </div>
        <Tag tone="accent">+{badge?.points || 0}</Tag>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden card-hover">
      <div className="bg-celebrate-gradient p-5 text-white relative">
        <div className="flex items-center justify-between">
          <Tag tone="ghost" className="!bg-white/20 !text-white !border-white/30">
            <Award size={12} /> {badge?.name}
          </Tag>
          <div className="text-3xl">{badge?.emoji || "🏆"}</div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Avatar name={to?.name} size="lg" ring />
          <div>
            <p className="font-display font-bold text-xl leading-tight">
              {to?.name}
            </p>
            <p className="text-sm text-white/80">{to?.role}</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
          “{recognition.message}”
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={from?.name} size="sm" />
            <div className="leading-tight">
              <p className="text-xs muted">From</p>
              <p className="text-sm font-semibold">{from?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs muted">Points</p>
            <p className="font-display text-lg font-bold text-accent-600">
              +{badge?.points || 0}
            </p>
          </div>
        </div>
        <p className="text-[11px] muted mt-3">{timeAgo(recognition.createdAt)}</p>
      </div>
    </div>
  );
}

export default RecognitionCard;
