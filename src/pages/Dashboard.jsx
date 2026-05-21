import {
  Users,
  Trophy,
  Calendar,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/widgets/HeroCarousel";
import StatsCard from "../components/cards/StatsCard";
import LeadershipMessageWidget from "../components/widgets/LeadershipMessageWidget";
import LeadershipMeetWidget from "../components/widgets/LeadershipMeetWidget";
import EngagementCalendar from "../components/widgets/EngagementCalendar";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";
import RecognitionSpotlight from "../components/widgets/RecognitionSpotlight";
import PollWidget from "../components/widgets/PollWidget";
import NewJoineeWidget from "../components/widgets/NewJoineeWidget";
import BirthdayWidget from "../components/widgets/BirthdayWidget";
import MilestonesTimeline from "../components/widgets/MilestonesTimeline";
import DepartmentFootprintGrid from "../components/widgets/DepartmentFootprintGrid";
import QuickActions from "../components/widgets/QuickActions";
import EngagementChart from "../components/charts/EngagementChart";
import SectionHeader from "../components/common/SectionHeader";
import useStore from "../store/useStore";
import { useVisiblePosts } from "../store/selectors";

function Dashboard() {
  const employees = useStore((s) => s.employees);
  const recognitions = useStore((s) => s.recognitions);
  const events = useStore((s) => s.events);
  const visiblePosts = useVisiblePosts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top: hero carousel for vision/leadership */}
      <HeroCarousel />

      {/* Quick KPIs prioritized for engagement */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Colleagues"
          value={employees.length.toLocaleString()}
          delta="+3 new this month"
          icon={Users}
          tone="brand"
        />
        <StatsCard
          title="Engagement score"
          value="91%"
          delta="+7 vs last month"
          icon={HeartHandshake}
          tone="success"
        />
        <StatsCard
          title="Recognitions"
          value={recognitions.length.toString()}
          delta="+12 this week"
          icon={Trophy}
          tone="accent"
        />
        <StatsCard
          title="Upcoming events"
          value={events.length.toString()}
          delta={`${events[0] ? events[0].title : "none"}`}
          icon={Calendar}
          tone="warning"
        />
      </div>

      {/* Two-column: engagement chart + leadership messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={Sparkles}
            title="Engagement at a glance"
            subtitle="Monthly engagement score across the org"
          />
          <EngagementChart />
        </div>
        <LeadershipMessageWidget />
      </div>

      {/* Leadership meet outcomes + recognition spotlight + poll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadershipMeetWidget />
        <div className="lg:col-span-1">
          <RecognitionSpotlight />
        </div>
        <PollWidget />
      </div>

      {/* New joinees carousel */}
      <NewJoineeWidget />

      {/* Department footprints */}
      <DepartmentFootprintGrid />

      {/* Engagement calendar + leaderboard + birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementCalendar />
        </div>
        <div className="space-y-6">
          <LeaderboardWidget />
          <BirthdayWidget />
        </div>
      </div>

      {/* Milestones + Quick actions + Recent updates link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MilestonesTimeline />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <div className="card p-5">
            <SectionHeader
              title="Latest in feed"
              subtitle={`${visiblePosts.length} updates visible to you`}
            />
            <ul className="space-y-3">
              {visiblePosts.slice(0, 3).map((p) => (
                <li key={p.id}>
                  <Link
                    to="/feed"
                    className="block p-3 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800/60 transition"
                  >
                    <p className="text-sm font-semibold line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-xs muted line-clamp-2 mt-0.5">
                      {p.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/feed"
              className="mt-2 inline-flex text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline"
            >
              Open feed →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
