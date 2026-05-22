import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  MapPin,
  Users,
  CalendarOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "../../store/useStore";
import SectionHeader from "../common/SectionHeader";
import Tag from "../common/Tag";
import { cn, formatDate } from "../../lib/utils";

// A fully-functional events calendar:
// - Navigate between months with prev/next + Today
// - Click a date to focus its events in the panel below
// - "No events on this day" empty state when nothing is scheduled
// - Visually highlights today, the selected day, and days that have events

function buildMonthCells(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startCol = first.getDay(); // 0 = Sun
  const days = last.getDate();
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function EventsCalendar() {
  const events = useStore((s) => s.events);
  const rsvpEvent = useStore((s) => s.rsvpEvent);

  const today = useMemo(() => new Date(), []);
  // `cursor` = the month being viewed; always pinned to day 1 of that month.
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState(today);

  const cells = useMemo(
    () => buildMonthCells(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  // Map day-of-month → array of events that fall on that day in the
  // currently-viewed month.
  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const d = new Date(ev.date);
      if (
        d.getFullYear() === cursor.getFullYear() &&
        d.getMonth() === cursor.getMonth()
      ) {
        const arr = map.get(d.getDate()) || [];
        arr.push(ev);
        map.set(d.getDate(), arr);
      }
    }
    return map;
  }, [events, cursor]);

  // Events on the currently-selected day, sorted by time.
  const eventsForSelected = useMemo(() => {
    if (!selected) return [];
    return events
      .filter((ev) => isSameDay(new Date(ev.date), selected))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, selected]);

  function prevMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }
  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  }

  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card p-4 sm:p-5">
      <SectionHeader
        icon={CalIcon}
        title="Events calendar"
        subtitle="Click a date to see what's happening"
        action={
          <button
            onClick={goToday}
            className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline px-2 py-1"
          >
            Today
          </button>
        }
      />

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-display font-bold text-base sm:text-lg text-ink-900 dark:text-ink-100">
          {monthLabel}
        </p>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-300 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1.5 text-[11px] font-semibold uppercase tracking-wider muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d.slice(0, 1)}
          </div>
        ))}
      </div>

      {/* Date grid — animate when month changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${cursor.getFullYear()}-${cursor.getMonth()}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-7 gap-1.5 mt-1.5"
        >
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selected);
            const evs = eventsByDay.get(d.getDate()) || [];
            return (
              <button
                key={i}
                onClick={() => setSelected(d)}
                aria-pressed={isSelected}
                aria-label={`${d.toDateString()}, ${evs.length} event${evs.length === 1 ? "" : "s"}`}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center border text-xs sm:text-sm transition relative",
                  isSelected
                    ? "bg-brand-600 text-white border-brand-600 font-bold shadow-md"
                    : isToday
                      ? "bg-brand-50 dark:bg-brand-500/15 border-brand-300 dark:border-brand-500/40 text-brand-700 dark:text-brand-200 font-bold"
                      : evs.length
                        ? "bg-brand-50/60 dark:bg-brand-500/10 border-brand-100 dark:border-brand-500/25 text-brand-700 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-500/20"
                        : "bg-white dark:bg-ink-900 border-ink-100 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800",
                )}
              >
                <span>{d.getDate()}</span>
                {evs.length > 0 && (
                  <span className="mt-0.5 flex gap-0.5">
                    {evs.slice(0, 3).map((_, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "w-1 h-1 rounded-full",
                          isSelected ? "bg-white" : "bg-brand-600",
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected-day panel */}
      <div className="mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <CalIcon size={14} className="text-brand-600 shrink-0" />
            <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate">
              {selected
                ? formatDate(selected, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Select a date"}
            </p>
          </div>
          {eventsForSelected.length > 0 && (
            <Tag tone="brand">
              {eventsForSelected.length} event
              {eventsForSelected.length === 1 ? "" : "s"}
            </Tag>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected ? selected.toISOString().slice(0, 10) : "none"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {eventsForSelected.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl bg-ink-50 dark:bg-ink-800/40 border border-dashed border-ink-200 dark:border-ink-700">
                <CalendarOff
                  size={20}
                  className="mx-auto text-ink-400 dark:text-ink-500"
                />
                <p className="mt-2 text-sm font-semibold text-ink-700 dark:text-ink-200">
                  No events on this day
                </p>
                <p className="text-xs muted mt-1">
                  Pick another date or browse all upcoming events below.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {eventsForSelected.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition"
                  >
                    <div className="text-center w-11 shrink-0 pt-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                        {new Date(e.date).toLocaleString(undefined, {
                          month: "short",
                        })}
                      </p>
                      <p className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 leading-tight">
                        {new Date(e.date).getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag tone="brand">{e.type}</Tag>
                        {e.rsvpedByMe && (
                          <Tag tone="success">RSVP'd</Tag>
                        )}
                      </div>
                      <p className="font-semibold text-sm mt-1.5 text-ink-900 dark:text-ink-100 break-words">
                        {e.title}
                      </p>
                      {e.description && (
                        <p className="text-xs muted line-clamp-2 mt-0.5">
                          {e.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] muted">
                        {e.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={11} /> {e.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Users size={11} /> {e.rsvp || 0} attending
                        </span>
                      </div>
                    </div>
                    {!e.rsvpedByMe && (
                      <button
                        onClick={() => rsvpEvent(e.id)}
                        className="btn-primary !py-1.5 !px-3 text-xs shrink-0 self-start"
                      >
                        RSVP
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EventsCalendar;
