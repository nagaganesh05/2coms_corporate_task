import { Link } from "react-router-dom";
import {
  Trophy,
  Newspaper,
  MessagesSquare,
  Calendar,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

const actions = [
  {
    label: "Give appreciation",
    to: "/recognition",
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Share an update",
    to: "/feed",
    icon: Newspaper,
    color: "from-brand-600 to-violet-500",
  },
  {
    label: "Ask in forum",
    to: "/forum",
    icon: MessagesSquare,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "RSVP to event",
    to: "/events",
    icon: Calendar,
    color: "from-rose-500 to-pink-500",
  },
  {
    label: "Browse policies",
    to: "/knowledge",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Office gallery",
    to: "/gallery",
    icon: ImageIcon,
    color: "from-fuchsia-500 to-purple-500",
  },
];

function QuickActions() {
  return (
    <div className="card p-5">
      <p className="font-display font-bold text-base mb-3">Quick actions</p>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {actions.map(({ label, to, icon: Icon, color }) => (
          <Link
            key={to + label}
            to={to}
            className="group rounded-2xl border border-ink-100 dark:border-ink-800 p-3 hover:shadow-card-hover hover:-translate-y-0.5 transition flex flex-col items-start gap-2"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl text-white bg-gradient-to-br flex items-center justify-center",
                color,
              )}
            >
              <Icon size={16} />
            </div>
            <p className="text-xs font-semibold text-ink-800 dark:text-ink-100 leading-tight">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
