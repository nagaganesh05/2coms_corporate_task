import { useMemo } from "react";
import { Cake, Gift } from "lucide-react";
import { useUpcomingBirthdays } from "../../store/selectors";
import Avatar from "../common/Avatar";
import SectionHeader from "../common/SectionHeader";
import { formatDate } from "../../lib/utils";

function BirthdayWidget() {
  const all = useUpcomingBirthdays(30);
  const upcoming = useMemo(() => all.slice(0, 5), [all]);

  return (
    <div className="card p-5">
      <SectionHeader
        icon={Cake}
        title="Birthdays this month"
        subtitle="Drop a wish in the feed"
      />
      {upcoming.length === 0 ? (
        <p className="text-sm muted">No birthdays in the next 30 days.</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map(({ employee, in: days, on }) => (
            <li
              key={employee.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800/50"
            >
              <Avatar name={employee.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{employee.name}</p>
                <p className="text-xs muted">
                  {formatDate(on, { day: "numeric", month: "short" })}
                  {" · "}
                  {days === 0 ? "Today 🎉" : days === 1 ? "Tomorrow" : `in ${days} days`}
                </p>
              </div>
              <button className="btn-ghost !px-2 !py-1.5 text-xs">
                <Gift size={14} /> Wish
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BirthdayWidget;
