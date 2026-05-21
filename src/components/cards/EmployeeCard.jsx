import { Mail, MapPin } from "lucide-react";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import useStore from "../../store/useStore";

function EmployeeCard({ employee, onView }) {
  const dept = useStore((s) => s.getDepartment(employee.departmentId));

  return (
    <div className="card p-5 card-hover">
      <div className="flex items-center gap-3">
        <Avatar name={employee.name} size="lg" ring />
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base text-ink-900 dark:text-ink-100 truncate">
            {employee.name}
          </h3>
          <p className="text-sm muted truncate">{employee.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag tone="brand">{dept?.name}</Tag>
        {employee.location && (
          <Tag tone="ghost" icon={<MapPin size={10} />}>
            {employee.location}
          </Tag>
        )}
      </div>

      {employee.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {employee.skills.slice(0, 3).map((s) => (
            <Tag key={s} tone="ink">
              {s}
            </Tag>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <a
          href={`mailto:${employee.email}`}
          className="text-xs muted truncate inline-flex items-center gap-1.5 hover:text-brand-600"
        >
          <Mail size={12} /> {employee.email}
        </a>
        <button
          onClick={() => onView?.(employee)}
          className="text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default EmployeeCard;
