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
function formatJoinDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format a DOB as "4 Aug" (year omitted for privacy)
function formatBirthday(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
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
  // Track the active employee by ID so the modal always reflects the
  // current store state — not a stale snapshot captured at click time.
  const [activeId, setActiveId] = useState(null);

  // Cascading filters: each dropdown's options narrow based on the
  // other selections so users can never pick an empty intersection.
  const departmentsForVertical = useMemo(() => {
    if (vertical === "all") return departments;
    return departments.filter((d) => d.verticalId === vertical);
  }, [departments, vertical]);

  const employeesAfterStructural = useMemo(() => {
    return employees.filter((e) => {
      if (dept !== "all" && e.departmentId !== dept) return false;
      if (vertical !== "all") {
        const d = departments.find((x) => x.id === e.departmentId);
        if (d?.verticalId !== vertical) return false;
      }
      return true;
    });
  }, [employees, departments, dept, vertical]);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(employeesAfterStructural.map((e) => e.location).filter(Boolean)),
      ).sort(),
    [employeesAfterStructural],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return employeesAfterStructural.filter((e) => {
      if (location !== "all" && e.location !== location) return false;
      if (!needle) return true;
      const haystack = [e.name, e.role, e.email, e.location, ...(e.skills || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [employeesAfterStructural, q, location]);

  const hasFilters =
    !!q || dept !== "all" || vertical !== "all" || location !== "all";

  function clearFilters() {
    setQ("");
    setDept("all");
    setVertical("all");
    setLocation("all");
  }

  // Always derive `active` from the current employees list so edits
  // elsewhere flow into the open modal automatically.
  const active = useMemo(
    () => (activeId ? employees.find((e) => e.id === activeId) || null : null),
    [activeId, employees],
  );

  // Memoise everything the modal renders so search keystrokes do not
  // recompute manager / teammates / recognitions on every render.
  const activeDept = useMemo(
    () => (active ? departments.find((d) => d.id === active.departmentId) : null),
    [active, departments],
  );
  const activeVertical = useMemo(
    () =>
      activeDept ? verticals.find((v) => v.id === activeDept.verticalId) : null,
    [activeDept, verticals],
  );
  const manager = useMemo(
    () =>
      active?.manager ? employees.find((e) => e.id === active.manager) : null,
    [active, employees],
  );
  const teammates = useMemo(() => {
    if (!active) return [];
    return employees
      .filter((e) => e.departmentId === active.departmentId && e.id !== active.id)
      .slice(0, 8);
  }, [active, employees]);
  const empRecognitions = useMemo(() => {
    if (!active) return [];
    return recognitions
      .filter((r) => r.toId === active.id)
      .slice() // don't mutate store
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((r) => ({ ...r, badge: badges.find((b) => b.id === r.badgeId) }));
  }, [active, recognitions, badges]);
  const birthday = useMemo(
    () => (active ? formatBirthday(active.dob) : null),
    [active],
  );

  // Dropdown handlers — selecting a vertical clears any incompatible
  // department; selecting a department auto-sets its vertical.
  function onChangeVertical(v) {
    setVertical(v);
    if (v !== "all") {
      const stillValid = departments.find(
        (d) => d.id === dept && d.verticalId === v,
      );
      if (!stillValid) setDept("all");
    }
  }
  function onChangeDept(d) {
    setDept(d);
    if (d !== "all") {
      const found = departments.find((x) => x.id === d);
      if (found && vertical !== "all" && found.verticalId !== vertical) {
        setVertical(found.verticalId);
      }
    }
  }

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
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="btn-outline text-sm"
            aria-label="Clear all filters"
          >
            <X size={14} /> Clear filters
          </button>
        )}
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
          onChange={(e) => onChangeVertical(e.target.value)}
          className="input md:col-span-2"
          aria-label="Filter by vertical"
        >
          <option value="all">All verticals</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <select
          value={dept}
          onChange={(e) => onChangeDept(e.target.value)}
          className="input md:col-span-3"
          aria-label="Filter by department"
        >
          <option value="all">All departments</option>
          {departmentsForVertical.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input md:col-span-2"
          aria-label="Filter by location"
        >
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No colleagues match your filters"
          hint="Try clearing a filter or searching for a different skill."
          action={
            <button onClick={clearFilters} className="btn-outline text-sm">
              <X size={14} /> Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((e) => (
            <EmployeeCard
              key={e.id}
              employee={e}
              onView={() => setActiveId(e.id)}
            />
          ))}
        </div>
      )}

      {/* Profile preview modal — title is the employee's name */}
      <Modal
        open={!!active}
        onClose={() => setActiveId(null)}
        size="md"
        title={active?.name || "Employee profile"}
      >
        {active && (
          <div>
            {/* Header — mobile-friendly */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar name={active.name} size="xl" framed />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold text-ink-900 dark:text-ink-100 break-words">
                  {active.name}
                </p>
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
                  {formatJoinDate(active.joinDate)}
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
                    onClick={() => setActiveId(manager.id)}
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
                      onClick={() => setActiveId(t.id)}
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

            {/* Recognitions — newest first, with explicit "+N more" */}
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
                {empRecognitions.length > 5 && (
                  <p className="mt-2 text-xs muted text-center">
                    +{empRecognitions.length - 5} more
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Directory;
