import { useMemo, useState } from "react";
import { Calendar, Filter } from "lucide-react";
import useStore from "../store/useStore";
import EventCard from "../components/cards/EventCard";
import EngagementCalendar from "../components/widgets/EngagementCalendar";
import EmptyState from "../components/common/EmptyState";
import { cn } from "../lib/utils";

const TYPES = [
  "all",
  "townhall",
  "hackathon",
  "wellness",
  "celebration",
  "launch",
  "kickoff",
];

function Events() {
  const events = useStore((s) => s.events);
  const rsvpEvent = useStore((s) => s.rsvpEvent);
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const list = type === "all" ? events : events.filter((e) => e.type === type);
    return [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, type]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Events &amp; celebrations
          </h1>
          <p className="muted text-sm">
            Town halls, hackathons, wellness — where the company comes together.
          </p>
        </div>
      </div>

      {/* Calendar + filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementCalendar />
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Filter size={14} className="text-ink-400" />
            <p className="font-semibold">Filter by type</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition",
                  type === t
                    ? "bg-brand-600 text-white"
                    : "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events match this filter"
          hint="Switch to ‘all’ to see everything coming up."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} onRSVP={rsvpEvent} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
