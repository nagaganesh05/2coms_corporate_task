import { useMemo, useState } from "react";
import { Users, X } from "lucide-react";
import useStore from "../store/useStore";
import EmployeeCard from "../components/cards/EmployeeCard";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Modal from "../components/common/Modal";

function Directory() {
  const employees = useStore((s) => s.employees);
  const departments = useStore((s) => s.departments);
  const verticals = useStore((s) => s.verticals);
  const recognitions = useStore((s) => s.recognitions);
  const badges = useStore((s) => s.badges);

  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [vertical, setVertical] = useState("all");
  const [location, setLocation] = useState("all");
  const [active, setActive] = useState(null);

  const locations = useMemo(
    () => Array.from(new Set(employees.map((e) => e.location))).sort(),
    [employees],
  );

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (dept !== "all" && e.departmentId !== dept) return false;
      if (vertical !== "all") {
        const d = departments.find((x) => x.id === e.departmentId);
        if (d?.verticalId !== vertical) return false;
      }
      if (location !== "all" && e.location !== location) return false;
      if (q) {
        const haystack = [
          e.name,
          e.role,
          e.email,
          e.location,
          ...(e.skills || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [employees, departments, q, dept, vertical, location]);

  const empRecognitions = active
    ? recognitions
        .filter((r) => r.toId === active.id)
        .map((r) => ({
          ...r,
          badge: badges.find((b) => b.id === r.badgeId),
        }))
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Employee directory
          </h1>
          <p className="text-sm muted">
            {filtered.length} of {employees.length} colleagues
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search by name, role or skill"
          />
        </div>
        <select
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
          className="input md:col-span-2"
        >
          <option value="all">All verticals</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="input md:col-span-3"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input md:col-span-2"
        >
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No colleagues match your filters"
          hint="Try clearing a filter or searching for a different skill."
          action={
            <button
              onClick={() => {
                setQ("");
                setDept("all");
                setVertical("all");
                setLocation("all");
              }}
              className="btn-outline text-sm"
            >
              <X size={14} /> Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((e) => (
            <EmployeeCard key={e.id} employee={e} onView={setActive} />
          ))}
        </div>
      )}

      {/* Profile preview modal */}
      <Modal open={!!active} onClose={() => setActive(null)} size="md" title="Employee profile">
        {active && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={active.name} size="2xl" ring />
              <div>
                <h2 className="font-display text-xl font-bold">{active.name}</h2>
                <p className="muted text-sm">{active.role}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Tag tone="brand">
                    {departments.find((d) => d.id === active.departmentId)?.name}
                  </Tag>
                  <Tag tone="ghost">{active.location}</Tag>
                </div>
              </div>
            </div>

            {active.bio && (
              <p className="mt-4 text-sm text-ink-700 dark:text-ink-300">
                {active.bio}
              </p>
            )}

            {active.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs muted uppercase tracking-wider font-semibold">Skills</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {active.skills.map((s) => (
                    <Tag key={s} tone="ink">{s}</Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs muted">Email</p>
                <a className="text-brand-600 hover:underline" href={`mailto:${active.email}`}>
                  {active.email}
                </a>
              </div>
              <div>
                <p className="text-xs muted">Joined</p>
                <p>{active.joinDate}</p>
              </div>
            </div>

            {empRecognitions.length > 0 && (
              <div className="mt-5">
                <p className="text-xs muted uppercase tracking-wider font-semibold">
                  Recognitions ({empRecognitions.length})
                </p>
                <ul className="mt-2 space-y-1.5">
                  {empRecognitions.slice(0, 5).map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-ink-50 dark:bg-ink-800/50"
                    >
                      <span className="text-xl">{r.badge?.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{r.badge?.name}</p>
                        <p className="text-xs muted line-clamp-1">{r.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Directory;
