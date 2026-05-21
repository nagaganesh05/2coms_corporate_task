import { useState } from "react";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Megaphone,
  Trophy,
  Sparkles,
  Lock,
  Globe2,
} from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

const TYPES = [
  { id: "experience", label: "Experience", icon: Sparkles, tone: "ghost" },
  { id: "celebration", label: "Celebration", icon: Trophy, tone: "accent" },
  { id: "project_win", label: "Project win", icon: Megaphone, tone: "success" },
];

function PostComposer() {
  const me = useStore((s) => s.getCurrentUser());
  const departments = useStore((s) => s.departments);
  const role = useStore((s) => s.role);
  const addPost = useStore((s) => s.addPost);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("experience");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visAll, setVisAll] = useState(true);
  const [scope, setScope] = useState(me?.departmentId || "engineering");

  function reset() {
    setTitle("");
    setBody("");
    setVisAll(true);
    setOpen(false);
  }

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addPost({
      type,
      title: title.trim(),
      body: body.trim(),
      visibility: visAll ? ["all"] : [scope],
    });
    toast.success("Posted to the feed");
    reset();
  }

  const isHrAdmin = role === "admin" || role === "hr";

  return (
    <div className="card p-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 p-2 text-left text-ink-500 hover:text-ink-700"
        >
          <Avatar name={me?.name} size="md" />
          <span className="flex-1 px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:border-brand-300 transition">
            Share an update, win, or experience…
          </span>
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <Avatar name={me?.name} size="md" />
            <div>
              <p className="font-semibold text-sm">{me?.name}</p>
              <p className="text-xs muted">{me?.role}</p>
            </div>
          </div>

          {/* Type selector */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => setType(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                  type === id
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800",
                )}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
            {isHrAdmin && (
              <button
                type="button"
                onClick={() => setType("announcement")}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                  type === "announcement"
                    ? "bg-warning-500 text-white border-warning-500"
                    : "border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800",
                )}
              >
                <Megaphone size={12} /> Announcement
              </button>
            )}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a clear title…"
            className="input"
            maxLength={120}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What do you want to share?"
            className="input min-h-[120px] resize-y"
            maxLength={1200}
          />

          {/* Visibility */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="muted">Visible to</span>
            <div className="inline-flex bg-ink-100 dark:bg-ink-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setVisAll(true)}
                className={cn(
                  "px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-semibold",
                  visAll
                    ? "bg-white dark:bg-ink-900 shadow-sm"
                    : "text-ink-500",
                )}
              >
                <Globe2 size={12} /> Everyone
              </button>
              <button
                type="button"
                onClick={() => setVisAll(false)}
                className={cn(
                  "px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-semibold",
                  !visAll
                    ? "bg-white dark:bg-ink-900 shadow-sm"
                    : "text-ink-500",
                )}
              >
                <Lock size={12} /> Department
              </button>
            </div>
            {!visAll && (
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="input !py-1.5 !px-2 max-w-[180px] text-xs"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2 text-ink-400">
              <button
                type="button"
                title="Add image (coming soon)"
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <ImageIcon size={16} />
              </button>
              <button
                type="button"
                title="Emoji"
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <Smile size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !body.trim()}
                className="btn-primary text-sm"
              >
                <Send size={14} /> Post
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default PostComposer;
