import { Link } from "react-router-dom";
import {
  Shield,
  Megaphone,
  Sparkles,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import useStore from "../store/useStore";
import StatsCard from "../components/cards/StatsCard";
import EngagementChart from "../components/charts/EngagementChart";
import DepartmentImpactChart from "../components/charts/DepartmentImpactChart";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";
import SectionHeader from "../components/common/SectionHeader";
import Tag from "../components/common/Tag";
import { timeAgo } from "../lib/utils";

function AdminDashboard() {
  const employees = useStore((s) => s.employees);
  const posts = useStore((s) => s.posts);
  const recognitions = useStore((s) => s.recognitions);
  const moderationQueue = useStore((s) => s.moderationQueue);
  const notifications = useStore((s) => s.notifications);
  const role = useStore((s) => s.role);

  const pending = moderationQueue.filter((m) => m.status === "pending");
  const flagged = moderationQueue.filter((m) => m.status === "flagged");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Tag tone="brand" icon={<Shield size={12} />}>
            {role === "admin" ? "Admin console" : "HR console"}
          </Tag>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100 mt-2">
            Command center
          </h1>
          <p className="muted text-sm">
            Steward the platform — publish, moderate, and observe engagement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/content" className="btn-primary text-sm">
            <Megaphone size={14} /> Publish content
          </Link>
          <Link to="/admin/moderation" className="btn-outline text-sm">
            <Sparkles size={14} /> Open moderation
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total posts"
          value={posts.length.toLocaleString()}
          delta="+24 this week"
          icon={Megaphone}
          tone="brand"
        />
        <StatsCard
          title="Recognitions"
          value={recognitions.length.toLocaleString()}
          delta="+12 this week"
          icon={Sparkles}
          tone="accent"
        />
        <StatsCard
          title="Pending approvals"
          value={pending.length}
          delta={pending.length ? `${pending.length} need review` : "All clear"}
          icon={Clock}
          tone="warning"
        />
        <StatsCard
          title="Flagged content"
          value={flagged.length}
          delta={flagged.length ? "Action recommended" : "Healthy"}
          icon={AlertTriangle}
          tone={flagged.length ? "warning" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={TrendingUp}
            title="Engagement trend"
            subtitle="Org-wide score across the last six months"
            action={
              <Link
                to="/admin/analytics"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Open analytics →
              </Link>
            }
          />
          <EngagementChart />
        </div>
        <div className="card p-5">
          <SectionHeader
            icon={Users}
            title="Headcount snapshot"
            subtitle="Across departments"
          />
          <div className="space-y-1">
            {Array.from(
              new Set(employees.map((e) => e.departmentId)),
            ).map((d) => {
              const count = employees.filter((x) => x.departmentId === d).length;
              const dept = useStore.getState().getDepartment(d);
              return (
                <div
                  key={d}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 text-sm"
                >
                  <span className="font-medium">{dept?.name}</span>
                  <span className="font-display font-bold tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={BarChart3}
            title="Department impact"
            subtitle="Updates posted by each department"
          />
          <DepartmentImpactChart />
        </div>
        <LeaderboardWidget limit={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <SectionHeader
            icon={Sparkles}
            title="Moderation queue"
            subtitle="Most recent items"
            action={
              <Link
                to="/admin/moderation"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Open queue →
              </Link>
            }
          />
          {moderationQueue.length === 0 ? (
            <p className="text-sm muted">Queue is empty.</p>
          ) : (
            <ul className="divide-y divide-ink-100 dark:divide-ink-800">
              {moderationQueue.slice(0, 5).map((m) => (
                <li key={m.id} className="py-3 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold truncate">{m.title}</p>
                      <Tag
                        tone={m.status === "flagged" ? "danger" : "warning"}
                        className="capitalize"
                      >
                        {m.status}
                      </Tag>
                    </div>
                    <p className="text-xs muted line-clamp-1 mt-0.5">{m.body}</p>
                    {m.reason && (
                      <p className="text-[11px] text-warning-600 mt-0.5">
                        {m.reason}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <SectionHeader
            icon={Clock}
            title="Recent activity"
            subtitle="System & user activity"
          />
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {notifications.slice(0, 6).map((n) => (
              <li key={n.id} className="py-3 flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs muted mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
