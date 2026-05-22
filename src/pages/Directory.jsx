import { useMemo, useState } from "react";
import {
  Users,
  X,
  Mail,
  MapPin,
  Calendar,
  Cake,
  Building2,
  UserRound,
} from "lucide-react";
import useStore from "../store/useStore";
import EmployeeCard from "../components/cards/EmployeeCard";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Modal from "../components/common/Modal";

// Format an ISO date as "12 Mar 2014"
function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// Format a DOB as "4 Aug" (year omitted for privacy)
function formatBirthday(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  } catch {
    return null;
  }
}

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

  const activeDept = active
    ? departments.find((d) => d.id === active.departmentId)
    : null;
  const activeVertical = activeDept
    ? verticals.find((v) => v.id === activeDept.verticalId)
    : null;
  const manager = active?.manager
    ? employees.find((e) => e.id === active.manager)
    : null;
  const teammates = active
    ? employees
        .filter(
          (e) => e.departmentId === active.departmentId && e.id !== active.id,
        )
        .slice(0, 8)
    : [];
  const birthday = active ? formatBirthday(active.dob) : null;

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
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        size="md"
        title="Employee profile"
      >
        {active && (
          <div>
            {/* Header — mobile-friendly */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar name={active.name} size="xl" framed />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100 break-words">
                  {active.name}
                </h2>
                <p className="muted text-sm">{active.role}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeVertical && (
                    <Tag tone="ghost" icon={<Building2 size={10} />}>
                      {activeVertical.name}
                    </Tag>
                  )}
                  {activeDept && <Tag tone="brand">{activeDept.name}</Tag>}
                  {active.location && (
                    <Tag tone="ghost" icon={<MapPin size={10} />}>
                      {active.location}
                    </Tag>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${active.email}`}
                    className="btn-primary text-xs inline-flex items-center gap-1.5"
                  >
                    <Mail size={14} /> Send email
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            {active.bio && (
              <p className="mt-4 text-sm text-ink-700 dark:text-ink-300 break-words leading-relaxed">
                {active.bio}
              </p>
            )}

            {/* Quick info grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50 min-w-0">
                <p className="text-xs muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Mail size={11} /> Email
                </p>
                <a
                  className="text-sm text-brand-600 hover:underline break-all"
                  href={`mailto:${active.email}`}
                >
                  {active.email}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50">
                <p className="text-xs muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Calendar size={11} /> Joined
                </p>
                <p className="text-sm text-ink-900 dark:text-ink-100">
                  {formatDate(active.joinDate)}
                </p>
              </div>
              {birthday && (
                <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50">
                  <p className="text-xs muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Cake size={11} /> Birthday
                  </p>
                  <p className="text-sm text-ink-900 dark:text-ink-100">
                    {birthday}
                  </p>
                </div>
              )}
              <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50 min-w-0">
                <p className="text-xs muted uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <UserRound size={11} /> Reports to
                </p>
                {manager ? (
                  <button
                    onClick={() => setActive(manager)}
                    className="mt-1 flex items-center gap-2 group min-w-0 w-full text-left"
                  >
                    <Avatar name={manager.name} size="sm" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink-900 dark:text-ink-100 group-hover:text-brand-600 truncate">
                        {manager.name}
                      </span>
                      <span className="block text-[11px] muted truncate">
                        {manager.role}
                      </span>
                    </span>
                  </button>
                ) : (
                  <p className="text-sm text-ink-900 dark:text-ink-100">—</p>
                )}
              </div>
            </div>

            {/* Skills */}
            {active.skills?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs muted uppercase tracking-wider font-semibold">
                  Skills
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {active.skills.map((s) => (
                    <Tag key={s} tone="ink">
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Teammates */}
            {teammates.length > 0 && (
              <div className="mt-5">
                <p className="text-xs muted uppercase tracking-wider font-semibold">
                  Teammates in {activeDept?.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {teammates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActive(t)}
                      className="flex items-center gap-2 px-2 py-1 rounded-full bg-ink-50 dark:bg-ink-800/50 hover:bg-ink-100 dark:hover:bg-ink-800 transition min-w-0"
                      title={`${t.name} · ${t.role}`}
                    >
                      <Avatar name={t.name} size="xs" />
                      <span className="text-xs font-medium text-ink-800 dark:text-ink-200 truncate max-w-[120px]">
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recognitions */}
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
                      <span className="text-xl shrink-0">{r.badge?.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {r.badge?.name}
                        </p>
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
