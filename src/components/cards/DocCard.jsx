import { FileText, Film, FileType2, Download, ExternalLink } from "lucide-react";
import useStore from "../../store/useStore";
import { timeAgo } from "../../lib/utils";
import Tag from "../common/Tag";

const TYPE_META = {
  PDF: {
    icon: FileType2,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  Doc: {
    icon: FileText,
    color: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
  },
  Video: {
    icon: Film,
    color: "bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300",
  },
};

function DocCard({ doc }) {
  const owner = useStore((s) => s.getEmployee(doc.ownerId));
  const meta = TYPE_META[doc.type] || TYPE_META.Doc;
  const Icon = meta.icon;

  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag tone="ink">{doc.category}</Tag>
            <Tag tone="ghost">{doc.type}</Tag>
          </div>
          <h3 className="mt-2 font-semibold text-ink-900 dark:text-ink-100 truncate">
            {doc.title}
          </h3>
          <p className="text-xs muted mt-1">
            Owner: {owner?.name || "—"} · Updated {timeAgo(doc.updatedAt)}
            {doc.size ? ` · ${doc.size}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button className="btn-outline !py-2 !px-3 text-xs gap-1.5">
          <ExternalLink size={12} /> Open
        </button>
        <button className="btn-ghost !py-2 !px-3 text-xs gap-1.5">
          <Download size={12} /> Download
        </button>
      </div>
    </div>
  );
}

export default DocCard;
