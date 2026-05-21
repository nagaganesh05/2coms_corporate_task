import { CalendarHeart, Calendar as CalIcon } from "lucide-react";
import { useState } from "react";
import useStore from "../../store/useStore";
import SectionHeader from "../common/SectionHeader";
import Tag from "../common/Tag";
import { cn, formatDate } from "../../lib/utils";

const intensityClass = [
  "bg-ink-100 dark:bg-ink-800",
  "bg-brand-100 dark:bg-brand-500/20",
  "bg-brand-200 dark:bg-brand-500/35",
  "bg-brand-400 dark:bg-brand-500/55",
  "bg-brand-600 dark:bg-brand-500/80",
  "bg-brand-700 dark:bg-brand-400",
];

function Heatmap({ data }) {
  // arrange in a 12-week × 7-day grid (oldest left)
  const cells = data.slice(-84);
  const cols = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-[3px] min-w-min">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((d) => (
              <div
                key={d.date}
                title={`${d.date} · activity ${d.value}`}
                className={cn(
                  "w-3.5 h-3.5 rounded-[3px]",
                  intensityClass[Math.min(d.value, 5)],
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[11px] muted">
        <span>Less</span>
        {intensityClass.map((c, i) => (
          <span key={i} className={cn("w-3 h-3 rounded-sm", c)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function MonthGrid({ events, onDayClick }) {
  // simple month grid for current month showing event dots
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startCol = first.getDay(); // 0 Sun
  const days = last.getDate();
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));

  const eventsByDay = (() => {
    const map = new Map();
    for (const ev of events) {
      const d = new Date(ev.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const k = d.getDate();
        const arr = map.get(k) || [];
        arr.push(ev);
        map.set(k, arr);
      }
    }
    return map;
  })();

  return (
    <div>
      <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
        {first.toLocaleString(undefined, { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 gap-1.5 mt-2 text-[11px] muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 mt-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday =
            d.toDateString() === new Date().toDateString();
          const evs = eventsByDay.get(d.getDate()) || [];
          return (
            <button
              key={i}
              onClick={() => onDayClick?.(d, evs)}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center border text-xs transition",
                isToday
                  ? "bg-brand-600 text-white border-brand-600 font-bold"
                  : evs.length
                    ? "bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-200 hover:bg-brand-100"
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
                        isToday ? "bg-white" : "bg-brand-600",
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EngagementCalendar() {
  const heatmap = useStore((s) => s.engagementHeatmap);
  const events = useStore((s) => s.events);
  const [tab, setTab] = useState("month");
  const [selected, setSelected] = useState(null);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={CalendarHeart}
        title="Engagement calendar"
        subtitle="Pulse of the organization at a glance"
        action={
          <div className="inline-flex bg-ink-100 dark:bg-ink-800 rounded-xl p-1 text-xs">
            {["month", "heatmap"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold capitalize",
                  tab === t
                    ? "bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 shadow-sm"
                    : "text-ink-500",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {tab === "month" ? (
        <>
          <MonthGrid
            events={events}
            onDayClick={(d, evs) => setSelected({ date: d, events: evs })}
          />
          {selected && selected.events.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalIcon size={14} className="text-brand-600" />
                {formatDate(selected.date, {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <ul className="mt-2 space-y-1.5">
                {selected.events.map((e) => (
                  <li key={e.id} className="flex items-center gap-2 text-xs">
                    <Tag tone="brand">{e.type}</Tag>
                    <span className="font-medium">{e.title}</span>
                    <span className="muted">· {e.location}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <Heatmap data={heatmap} />
      )}
    </div>
  );
}

export default EngagementCalendar;
