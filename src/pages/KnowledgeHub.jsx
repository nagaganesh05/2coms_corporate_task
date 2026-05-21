import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import useStore from "../store/useStore";
import DocCard from "../components/cards/DocCard";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";
import { cn } from "../lib/utils";

function KnowledgeHub() {
  const docs = useStore((s) => s.knowledgeDocs);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(docs.map((d) => d.category)))],
    [docs],
  );

  const filtered = useMemo(() => {
    return docs
      .filter((d) => (cat === "all" ? true : d.category === cat))
      .filter((d) =>
        q ? d.title.toLowerCase().includes(q.toLowerCase()) : true,
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [docs, q, cat]);

  const grouped = filtered.reduce((acc, d) => {
    (acc[d.category] = acc[d.category] || []).push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
          Knowledge hub
        </h1>
        <p className="muted text-sm">
          Handbooks, policies, runbooks and reference material — searchable in one place.
        </p>
      </div>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <SearchBar value={q} onChange={setQ} placeholder="Search documents…" />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition",
                cat === c
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No documents found"
          hint="Try a different search or category."
        />
      ) : cat === "all" ? (
        <div className="space-y-7">
          {Object.entries(grouped).map(([category, list]) => (
            <section key={category}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-brand-600" />
                <h2 className="font-display font-bold text-base">
                  {category} <span className="text-xs muted">· {list.length}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((d) => (
                  <DocCard key={d.id} doc={d} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DocCard key={d.id} doc={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export default KnowledgeHub;
