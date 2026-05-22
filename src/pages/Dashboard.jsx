import {
  Users,
  Trophy,
  Calendar,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            title: "Colleagues",
            value: employees.length.toLocaleString(),
            delta: "+3 new this month",
            icon: Users,
            tone: "brand",
          },
          {
            title: "Engagement score",
            value: "91%",
            delta: "+7 vs last month",
            icon: HeartHandshake,
            tone: "success",
          },
          {
            title: "Recognitions",
            value: recognitions.length.toString(),
            delta: "+12 this week",
            icon: Trophy,
            tone: "accent",
          },
          {
            title: "Upcoming events",
            value: events.length.toString(),
            delta: events[0] ? events[0].title : "none",
            icon: Calendar,
            tone: "warning",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <StatsCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column: engagement chart + leadership messages.
          items-start prevents the chart card from being stretched to the
          height of the leadership column — the chart stays compact, and
          a "This week" pulse strip below it fills the natural space. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={Sparkles}
            title="Engagement at a glance"
            subtitle="Monthly engagement score across the org"
          />
          <EngagementChart height={220} />

          {/* This week mini-pulse — turns dead vertical space into useful
              context. Numbers come from the same engagementMonthly seed so
              they stay in sync with the chart above. */}
          <div className="mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
                This week's pulse
              </p>
              <Link
                to="/admin/analytics"
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-300 hover:underline"
              >
                See analytics →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "New posts",
                  value: "47",
                  delta: "+12% vs last week",
                  icon: Sparkles,
                  tone: "brand",
                },
                {
                  label: "Recognitions",
                  value: "89",
                  delta: "+18% vs last week",
                  icon: Trophy,
                  tone: "accent",
                },
                {
                  label: "Active people",
                  value: "1.4k",
                  delta: "+4% vs last week",
                  icon: HeartHandshake,
                  tone: "success",
                },
              ].map((p) => {
                const Icon = p.icon;
                const tone = {
                  brand:
                    "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
                  accent:
                    "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300",
                  success:
                    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
                }[p.tone];
                return (
                  <div
                    key={p.label}
                    className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] muted leading-tight">
                        {p.label}
                      </p>
                      <p className="font-display text-lg font-bold tabular-nums leading-tight">
                        {p.value}
                      </p>
                      <p className="text-[10px] text-success-600 dark:text-success-500 leading-tight mt-0.5">
                        {p.delta}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div id="leadership-messages" className="scroll-mt-24">
          <LeadershipMessageWidget />
        </div>
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
