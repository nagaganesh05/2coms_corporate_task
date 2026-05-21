import {
  BarChart3,
  TrendingUp,
  PieChart,
  Trophy,
  Users,
  Activity,
} from "lucide-react";
import useStore from "../store/useStore";
import StatsCard from "../components/cards/StatsCard";
import SectionHeader from "../components/common/SectionHeader";
import EngagementChart from "../components/charts/EngagementChart";
import ActivityChart from "../components/charts/ActivityChart";
import DepartmentChart from "../components/charts/DepartmentChart";
import DepartmentImpactChart from "../components/charts/DepartmentImpactChart";
import RecognitionTrendChart from "../components/charts/RecognitionTrendChart";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";

function Analytics() {
  const employees = useStore((s) => s.employees);
  const posts = useStore((s) => s.posts);
  const recognitions = useStore((s) => s.recognitions);
  const visiblePosts = useStore((s) => s.posts);
  const reach = Math.round(
    (visiblePosts.reduce(
      (a, p) => a + ((p.reactions?.like || 0) + (p.reactions?.celebrate || 0)),
      0,
    ) /
      employees.length) *
      100,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
          Organization analytics
        </h1>
        <p className="muted text-sm">
          The pulse of the company — engagement, reach, recognition and impact.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Engagement score"
          value="91%"
          delta="+7 vs last month"
          icon={Activity}
          tone="brand"
        />
        <StatsCard
          title="Active employees"
          value={employees.length}
          delta="+3 new"
          icon={Users}
          tone="success"
        />
        <StatsCard
          title="Reactions per head"
          value={`${reach}%`}
          delta="+12% vs last quarter"
          icon={TrendingUp}
          tone="accent"
        />
        <StatsCard
          title="Recognitions"
          value={recognitions.length}
          delta="+12 this week"
          icon={Trophy}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={TrendingUp}
            title="Engagement over time"
            subtitle="Monthly score trajectory"
          />
          <EngagementChart height={300} />
        </div>
        <div className="card p-5">
          <SectionHeader
            icon={PieChart}
            title="Department distribution"
            subtitle="Where the people are"
          />
          <DepartmentChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={BarChart3}
            title="Posts vs recognitions"
            subtitle="Content velocity by month"
          />
          <ActivityChart height={300} />
        </div>
        <LeaderboardWidget limit={6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <SectionHeader
            icon={BarChart3}
            title="Department impact"
            subtitle="Updates posted per department"
          />
          <DepartmentImpactChart />
        </div>
        <div className="card p-5">
          <SectionHeader
            icon={TrendingUp}
            title="Recognition trend"
            subtitle="How praise is flowing"
          />
          <RecognitionTrendChart />
        </div>
      </div>

      <div className="card p-5">
        <SectionHeader
          title="Top contributors"
          subtitle="By posts shared this period"
        />
        <ul className="divide-y divide-ink-100 dark:divide-ink-800">
          {Object.entries(
            posts.reduce((acc, p) => {
              acc[p.authorId] = (acc[p.authorId] || 0) + 1;
              return acc;
            }, {}),
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([id, count]) => {
              const e = employees.find((x) => x.id === id);
              if (!e) return null;
              return (
                <li
                  key={id}
                  className="py-3 flex items-center gap-3 text-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200 flex items-center justify-center text-[10px] font-bold">
                    {count}
                  </span>
                  <span className="font-semibold flex-1">{e.name}</span>
                  <span className="muted text-xs">{e.role}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
