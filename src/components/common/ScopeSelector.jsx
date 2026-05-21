import { Filter } from "lucide-react";
import useStore from "../../store/useStore";

// Lets HR/Admins choose which department lens they want to view content through.
// Employees see only their own scope.
function ScopeSelector() {
  const departments = useStore((s) => s.departments);
  const tenantScope = useStore((s) => s.tenantScope);
  const setTenantScope = useStore((s) => s.setTenantScope);
  const role = useStore((s) => s.role);

  const isHrOrAdmin = role === "admin" || role === "hr";
  if (!isHrOrAdmin) return null;

  const value = tenantScope === "all" ? "all" : tenantScope?.[0] || "all";

  function onChange(e) {
    const v = e.target.value;
    setTenantScope(v === "all" ? "all" : [v]);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
      <Filter size={14} className="text-ink-400" />
      <span className="hidden sm:inline">Lens</span>
      <select
        value={value}
        onChange={onChange}
        className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-lg px-2 py-1.5 text-sm"
      >
        <option value="all">All departments</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ScopeSelector;
