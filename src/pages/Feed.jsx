import { useMemo, useState } from "react";
import { Filter, Pin } from "lucide-react";
import useStore from "../store/useStore";
import FeedCard from "../components/cards/FeedCard";
import PostComposer from "../components/widgets/PostComposer";
import EmptyState from "../components/common/EmptyState";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";
import PollWidget from "../components/widgets/PollWidget";
import BirthdayWidget from "../components/widgets/BirthdayWidget";
import { cn } from "../lib/utils";

const FILTERS = [
  { id: "all", label: "All updates" },
  { id: "leadership", label: "Leadership" },
  { id: "project_win", label: "Project wins" },
  { id: "celebration", label: "Celebrations" },
  { id: "footprint", label: "Footprints" },
  { id: "announcement", label: "Announcements" },
  { id: "experience", label: "Experiences" },
];

function Feed() {
  const visiblePosts = useStore((s) => s.getVisiblePosts());
  const [filter, setFilter] = useState("all");

  const posts = useMemo(() => {
    const list = filter === "all" ? visiblePosts : visiblePosts.filter((p) => p.type === filter);
    // pinned first, then chronological
    return [...list].sort((a, b) => {
      const ap = a.pinned ? 1 : 0;
      const bp = b.pinned ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [visiblePosts, filter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">
        <PostComposer />

        {/* Filters */}
        <div className="card p-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter size={14} className="text-ink-400 ml-1 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition",
                filter === f.id
                  ? "bg-brand-600 text-white"
                  : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pinned indicator */}
        {posts.some((p) => p.pinned) && filter === "all" && (
          <p className="text-xs muted px-1 inline-flex items-center gap-1.5">
            <Pin size={12} /> Pinned by leadership
          </p>
        )}

        {posts.length === 0 ? (
          <EmptyState
            title="Nothing to show in this view"
            hint="Try a different filter or be the first to post."
          />
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <FeedCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <PollWidget />
        <LeaderboardWidget />
        <BirthdayWidget />
      </div>
    </div>
  );
}

export default Feed;
