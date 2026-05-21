import { useState } from "react";
import { Megaphone, MessageSquareQuote, Flag, Send } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import SectionHeader from "../components/common/SectionHeader";
import Tag from "../components/common/Tag";
import { cn, timeAgo } from "../lib/utils";

const TABS = [
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "leadership", label: "Leadership message", icon: MessageSquareQuote },
  { id: "milestone", label: "Milestone", icon: Flag },
];

function AnnouncementForm() {
  const departments = useStore((s) => s.departments);
  const publishAnnouncement = useStore((s) => s.publishAnnouncement);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("medium");
  const [visAll, setVisAll] = useState(true);
  const [scope, setScope] = useState(departments[0]?.id);

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    publishAnnouncement({
      title: title.trim(),
      body: body.trim(),
      visibility: visAll ? ["all"] : [scope],
      priority,
    });
    toast.success("Announcement published");
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Announcement title"
        className="input"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your announcement…"
        className="input min-h-[160px] resize-y"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs muted font-semibold uppercase tracking-wider">
            Priority
          </label>
          <div className="mt-1.5 inline-flex bg-ink-100 dark:bg-ink-800 rounded-xl p-1 text-xs">
            {["low", "medium", "high"].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold capitalize",
                  priority === p
                    ? "bg-white dark:bg-ink-900 shadow-sm"
                    : "text-ink-500",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs muted font-semibold uppercase tracking-wider">
            Visibility
          </label>
          <div className="mt-1.5 flex gap-2">
            <div className="inline-flex bg-ink-100 dark:bg-ink-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setVisAll(true)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold",
                  visAll ? "bg-white dark:bg-ink-900 shadow-sm" : "text-ink-500",
                )}
              >
                Everyone
              </button>
              <button
                type="button"
                onClick={() => setVisAll(false)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold",
                  !visAll ? "bg-white dark:bg-ink-900 shadow-sm" : "text-ink-500",
                )}
              >
                Department
              </button>
            </div>
            {!visAll && (
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="input !py-1.5 max-w-[180px]"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || !body.trim()}
        className="btn-primary"
      >
        <Send size={14} /> Publish announcement
      </button>
    </form>
  );
}

function LeadershipForm() {
  const publishLeadershipMessage = useStore((s) => s.publishLeadershipMessage);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    publishLeadershipMessage({ title: title.trim(), body: body.trim() });
    toast.success("Leadership message published");
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Headline (e.g. Vision 2026)"
        className="input"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your message to the company…"
        className="input min-h-[180px] resize-y"
      />
      <button type="submit" disabled={!title.trim() || !body.trim()} className="btn-primary">
        <Send size={14} /> Publish message
      </button>
    </form>
  );
}

function MilestoneForm() {
  const departments = useStore((s) => s.departments);
  const publishMilestone = useStore((s) => s.publishMilestone);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id);

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    publishMilestone({ title: title.trim(), body: body.trim(), departmentId });
    toast.success("Milestone added");
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Milestone title"
        className="input"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tell the story behind it…"
        className="input min-h-[140px] resize-y"
      />
      <div>
        <label className="text-xs muted font-semibold uppercase tracking-wider">
          Department
        </label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="input mt-1.5 max-w-xs"
        >
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={!title.trim() || !body.trim()} className="btn-primary">
        <Send size={14} /> Publish milestone
      </button>
    </form>
  );
}

function ContentManagement() {
  const [tab, setTab] = useState("announcement");
  const posts = useStore((s) => s.posts);
  const leadershipMessages = useStore((s) => s.leadershipMessages);
  const milestones = useStore((s) => s.milestones);

  const recentByTab = {
    announcement: posts.filter((p) => p.type === "announcement").slice(0, 5),
    leadership: leadershipMessages.slice(0, 5),
    milestone: milestones.slice(0, 5),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
          Content management
        </h1>
        <p className="muted text-sm">
          Publish announcements, share leadership messages, and record milestones.
        </p>
      </div>

      {/* Tabs */}
      <div className="card p-2 inline-flex gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 transition",
              tab === id
                ? "bg-brand-600 text-white"
                : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
            )}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <SectionHeader
            icon={TABS.find((t) => t.id === tab).icon}
            title={`New ${TABS.find((t) => t.id === tab).label.toLowerCase()}`}
            subtitle="Publishing pushes immediately to the right audiences"
          />
          {tab === "announcement" && <AnnouncementForm />}
          {tab === "leadership" && <LeadershipForm />}
          {tab === "milestone" && <MilestoneForm />}
        </div>

        <div className="card p-5">
          <SectionHeader
            title="Recently published"
            subtitle="Last 5 items in this stream"
          />
          {recentByTab[tab].length === 0 ? (
            <p className="text-sm muted">Nothing published yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentByTab[tab].map((p) => (
                <li
                  key={p.id}
                  className="p-3 rounded-xl border border-ink-100 dark:border-ink-800"
                >
                  <p className="font-semibold text-sm">{p.title}</p>
                  <p className="text-xs muted line-clamp-2 mt-1">
                    {p.body}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] muted">
                    {p.priority && (
                      <Tag
                        tone={
                          p.priority === "high"
                            ? "danger"
                            : p.priority === "medium"
                              ? "brand"
                              : "ink"
                        }
                      >
                        {p.priority}
                      </Tag>
                    )}
                    <span>{timeAgo(p.createdAt || p.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
