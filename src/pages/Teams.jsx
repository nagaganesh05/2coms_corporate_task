import { Users, Building2 } from "lucide-react";
import useStore from "../store/useStore";
import SectionHeader from "../components/common/SectionHeader";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import { cn } from "../lib/utils";

function Teams() {
  const verticals = useStore((s) => s.verticals);
  const departments = useStore((s) => s.departments);
  const employees = useStore((s) => s.employees);
  const getEmployee = useStore((s) => s.getEmployee);

  return (
    <div className="space-y-7 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
          Teams &amp; verticals
        </h1>
        <p className="muted text-sm mt-1">
          Discover what every team is working on across the company.
        </p>
      </div>

      {verticals.map((v) => {
        const deps = departments.filter((d) => d.verticalId === v.id);
        const totalPeople = employees.filter((e) =>
          deps.some((d) => d.id === e.departmentId),
        ).length;

        return (
          <section key={v.id}>
            <SectionHeader
              icon={Building2}
              title={v.name}
              subtitle={`${deps.length} departments · ${totalPeople} people`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {deps.map((d) => {
                const lead = getEmployee(d.lead);
                const members = employees.filter((e) => e.departmentId === d.id);
                return (
                  <div key={d.id} className="card overflow-hidden card-hover">
                    <div className={cn("h-1.5 bg-gradient-to-r", v.color)} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs muted uppercase tracking-wider font-semibold">
                            {v.name}
                          </p>
                          <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">
                            {d.name}
                          </h3>
                        </div>
                        <Tag tone="ink">
                          <Users size={10} /> {members.length}
                        </Tag>
                      </div>

                      {lead && (
                        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/50">
                          <Avatar name={lead.name} size="md" />
                          <div className="min-w-0">
                            <p className="text-xs muted">Lead</p>
                            <p className="text-sm font-semibold truncate">{lead.name}</p>
                            <p className="text-[11px] muted truncate">{lead.role}</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="text-xs muted">Members</p>
                        <div className="mt-2 flex -space-x-2">
                          {members.slice(0, 6).map((m) => (
                            <Avatar key={m.id} name={m.name} size="sm" ring />
                          ))}
                          {members.length > 6 && (
                            <span className="ml-3 text-xs muted self-center">
                              +{members.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Teams;
