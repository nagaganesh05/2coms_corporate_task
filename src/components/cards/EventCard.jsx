import { Calendar, MapPin, Users, Check } from "lucide-react";
import { formatDate } from "../../lib/utils";
import Tag from "../common/Tag";

const TYPE_TONE = {
  townhall: "brand",
  hackathon: "accent",
  wellness: "success",
  celebration: "accent",
  launch: "brand",
  kickoff: "warning",
};

function EventCard({ event, onRSVP }) {
  const date = new Date(event.date);
  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start gap-4">
        <div className="text-center w-14 shrink-0">
          <div className="rounded-xl overflow-hidden border border-ink-100 dark:border-ink-800">
            <div className="bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider py-1">
              {date.toLocaleString(undefined, { month: "short" })}
            </div>
            <div className="bg-white dark:bg-ink-800 py-1 font-display font-bold text-lg text-ink-900 dark:text-ink-100">
              {date.getDate()}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag tone={TYPE_TONE[event.type] || "brand"}>{event.type}</Tag>
            <Tag tone="ghost" icon={<Calendar size={10} />}>
              {formatDate(event.date, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </Tag>
          </div>
          <h3 className="mt-2 font-display font-bold text-base text-ink-900 dark:text-ink-100">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-1 text-sm muted line-clamp-2">
              {event.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs muted">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {event.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {event.rsvp || 0} attending
            </span>
          </div>
          <div className="mt-4">
            {event.rsvpedByMe ? (
              <span className="btn !bg-success-50 !text-success-600 dark:!bg-success-500/15 dark:!text-success-500 cursor-default">
                <Check size={14} /> RSVP confirmed
              </span>
            ) : (
              <button onClick={() => onRSVP?.(event.id)} className="btn-primary">
                RSVP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
