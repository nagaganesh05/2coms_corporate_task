import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Newspaper,
  BookOpen,
  Trophy,
  Building2,
  CornerDownLeft,
  X,
} from "lucide-react";
import useStore from "../../store/useStore";
import { useVisiblePosts } from "../../store/selectors";
import Avatar from "./Avatar";
import Tag from "./Tag";
import { cn } from "../../lib/utils";

// Global org-wide search.
// - Live fuzzy filter across employees + posts + docs + departments.
// - Open with Cmd/Ctrl+K, focus the input, or just start typing.
// - Click a result (or press Enter on the highlighted one) to navigate.
// - Visibility-aware: posts use the same `useVisiblePosts` hook the Feed
//   uses, so HR/Admin tenant scopes and department isolation are honored.

function score(haystack, needle) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  const idx = h.indexOf(n);
  if (idx === 0) return 75;
  if (idx > 0) return 50 - Math.min(idx, 30);
  return 0;
}

function bestScore(fields, needle) {
  let best = 0;
  for (const f of fields) {
    if (!f) continue;
    const s = score(String(f), needle);
    if (s > best) best = s;
  }
  return best;
}

function useGlobalSearchResults(query) {
  const employees = useStore((s) => s.employees);
  const departments = useStore((s) => s.departments);
  const knowledgeDocs = useStore((s) => s.knowledgeDocs);
  const posts = useVisiblePosts();
  const recognitions = useStore((s) => s.recognitions);
  const badges = useStore((s) => s.badges);

  return useMemo(() => {
    const q = query.trim();
    if (!q) return null;

    const empResults = employees
      .map((e) => ({
        kind: "employee",
        id: e.id,
        score: bestScore(
          [e.name, e.role, e.email, e.location, ...(e.skills || [])],
          q,
        ),
        item: e,
      }))
      .filter((r) => r.score > 0);

    const postResults = posts
      .map((p) => ({
        kind: "post",
        id: p.id,
        score: bestScore([p.title, p.body, p.type], q),
        item: p,
      }))
      .filter((r) => r.score > 0);

    const docResults = knowledgeDocs
      .map((d) => ({
        kind: "doc",
        id: d.id,
        score: bestScore([d.title, d.category, d.type], q),
        item: d,
      }))
      .filter((r) => r.score > 0);

    const deptResults = departments
      .map((d) => ({
        kind: "department",
        id: d.id,
        score: bestScore([d.name], q),
        item: d,
      }))
      .filter((r) => r.score > 0);

    const recResults = recognitions
      .map((r) => {
        const badge = badges.find((b) => b.id === r.badgeId);
        const recipient = employees.find((e) => e.id === r.toId);
        const giver = employees.find((e) => e.id === r.fromId);
        return {
          kind: "recognition",
          id: r.id,
          score: bestScore(
            [
              badge?.name,
              recipient?.name,
              giver?.name,
              r.message,
            ],
            q,
          ),
          item: { ...r, badge, recipient, giver },
        };
      })
      .filter((r) => r.score > 0);

    const sortAndCap = (arr, n) =>
      arr.sort((a, b) => b.score - a.score).slice(0, n);

    const all = [
      ...sortAndCap(empResults, 5),
      ...sortAndCap(postResults, 4),
      ...sortAndCap(docResults, 4),
      ...sortAndCap(deptResults, 3),
      ...sortAndCap(recResults, 3),
    ];

    return {
      flat: all,
      groups: [
        {
          key: "employee",
          label: "People",
          icon: Users,
          items: sortAndCap(empResults, 5),
        },
        {
          key: "post",
          label: "Posts",
          icon: Newspaper,
          items: sortAndCap(postResults, 4),
        },
        {
          key: "doc",
          label: "Documents",
          icon: BookOpen,
          items: sortAndCap(docResults, 4),
        },
        {
          key: "department",
          label: "Departments",
          icon: Building2,
          items: sortAndCap(deptResults, 3),
        },
        {
          key: "recognition",
          label: "Recognitions",
          icon: Trophy,
          items: sortAndCap(recResults, 3),
        },
      ].filter((g) => g.items.length > 0),
    };
  }, [
    query,
    employees,
    departments,
    posts,
    knowledgeDocs,
    recognitions,
    badges,
  ]);
}

function ResultRow({ result, active, onClick }) {
  const { kind, item } = result;

  let icon;
  let title;
  let subtitle;

  if (kind === "employee") {
    icon = <Avatar name={item.name} size="sm" />;
    title = item.name;
    subtitle = `${item.role} · ${item.location}`;
  } else if (kind === "post") {
    icon = (
      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center">
        <Newspaper size={14} />
      </div>
    );
    title = item.title;
    subtitle = item.body;
  } else if (kind === "doc") {
    icon = (
      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 flex items-center justify-center">
        <BookOpen size={14} />
      </div>
    );
    title = item.title;
    subtitle = `${item.category} · ${item.type}`;
  } else if (kind === "department") {
    icon = (
      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
        <Building2 size={14} />
      </div>
    );
    title = item.name;
    subtitle = "Department";
  } else if (kind === "recognition") {
    icon = (
      <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-500/15 text-accent-600 dark:text-accent-300 flex items-center justify-center">
        {item.badge?.emoji || <Trophy size={14} />}
      </div>
    );
    title = `${item.giver?.name} → ${item.recipient?.name}`;
    subtitle = item.message;
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.focus({ preventScroll: true })}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition",
        active
          ? "bg-brand-50 dark:bg-brand-500/15"
          : "hover:bg-ink-50 dark:hover:bg-ink-800/60",
      )}
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs muted truncate">{subtitle}</p>
        )}
      </div>
      {active && (
        <CornerDownLeft size={12} className="text-brand-500 shrink-0" />
      )}
    </button>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useGlobalSearchResults(query);
  const flat = results?.flat || [];

  // Keep highlight clamped without an effect (avoid setState-in-effect lint).
  const safeHighlight = Math.min(highlight, Math.max(0, flat.length - 1));

  // Cmd/Ctrl+K to focus + open
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Click outside to close
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(result) {
    if (!result) return;
    setOpen(false);
    setQuery("");
    switch (result.kind) {
      case "employee":
        navigate("/directory");
        break;
      case "post":
        navigate(`/feed#${result.id}`);
        break;
      case "doc":
        navigate("/knowledge");
        break;
      case "department":
        navigate("/teams");
        break;
      case "recognition":
        navigate("/recognition");
        break;
      default:
        break;
    }
  }

  function onInputKey(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[safeHighlight]);
    }
  }

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKey}
          placeholder="Search people, posts, documents…"
          className="input pl-9 pr-16"
          aria-label="Global search"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold rounded-md border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 text-ink-500">
            ⌘K
          </kbd>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 mt-2 card overflow-hidden z-50 animate-pop-in">
          {flat.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm muted">
                No matches for &ldquo;{query}&rdquo;.
              </p>
              <p className="text-xs muted mt-1">
                Try a name, project, policy or skill.
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {results.groups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.key} className="px-2 mb-2 last:mb-0">
                      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider muted flex items-center gap-1.5">
                        <Icon size={12} /> {group.label}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((r) => {
                          const idx = flat.findIndex(
                            (x) => x.kind === r.kind && x.id === r.id,
                          );
                          return (
                            <ResultRow
                              key={`${r.kind}-${r.id}`}
                              result={r}
                              active={idx === safeHighlight}
                              onClick={() => go(r)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-[11px] muted">
                <span className="flex items-center gap-2">
                  <Tag tone="ghost" className="!py-0.5 !px-1.5">↑↓</Tag>
                  navigate
                  <Tag tone="ghost" className="!py-0.5 !px-1.5">↵</Tag>
                  open
                  <Tag tone="ghost" className="!py-0.5 !px-1.5">esc</Tag>
                  close
                </span>
                <span>{flat.length} results</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
