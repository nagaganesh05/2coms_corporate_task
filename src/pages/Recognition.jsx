import { useState } from "react";
import { Trophy, Award, Send, Sparkles, Medal } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import RecognitionCard from "../components/cards/RecognitionCard";
import LeaderboardWidget from "../components/widgets/LeaderboardWidget";
import SectionHeader from "../components/common/SectionHeader";
import Modal from "../components/common/Modal";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import RecognitionTrendChart from "../components/charts/RecognitionTrendChart";
import { cn } from "../lib/utils";

function GiveRecognitionModal({ open, onClose }) {
  const employees = useStore((s) => s.employees);
  const me = useStore((s) => s.getCurrentUser());
  const badges = useStore((s) => s.badges);
  const sendRecognition = useStore((s) => s.sendRecognition);

  const [toId, setToId] = useState("");
  const [badgeId, setBadgeId] = useState(badges[0]?.id || "");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const candidates = employees
    .filter((e) => e.id !== me?.id)
    .filter((e) =>
      [e.name, e.role, e.email].join(" ").toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 8);

  function reset() {
    setToId("");
    setMessage("");
    setSearch("");
    onClose();
  }

  function submit(e) {
    e.preventDefault();
    if (!toId || !badgeId || !message.trim()) return;
    sendRecognition({ toId, badgeId, message: message.trim() });
    toast.success("Recognition sent — kudos shared!");
    reset();
  }

  return (
    <Modal open={open} onClose={reset} title="Send a recognition" size="md">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Recognize</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role or email…"
            className="input"
          />
          <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {candidates.map((e) => (
              <button
                type="button"
                key={e.id}
                onClick={() => setToId(e.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl border transition text-left",
                  toId === e.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800",
                )}
              >
                <Avatar name={e.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{e.name}</p>
                  <p className="text-[11px] muted truncate">{e.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Pick a badge</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((b) => (
              <button
                type="button"
                key={b.id}
                onClick={() => setBadgeId(b.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition",
                  badgeId === b.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800",
                )}
              >
                <div className="text-2xl">{b.emoji}</div>
                <p className="text-xs font-semibold mt-1">{b.name}</p>
                <p className="text-[11px] muted">+{b.points} points</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Why?</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Be specific — share what they did and the impact."
            className="input min-h-[100px] resize-y"
            maxLength={400}
          />
          <p className="text-[11px] muted mt-1">{message.length}/400</p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
          <button type="button" onClick={reset} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!toId || !message.trim()}
            className="btn-primary text-sm"
          >
            <Send size={14} /> Send recognition
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Recognition() {
  const recognitions = useStore((s) => s.recognitions);
  const badges = useStore((s) => s.badges);
  const [open, setOpen] = useState(false);

  const total = recognitions.length;
  const totalPoints = recognitions.reduce(
    (a, r) => a + (badges.find((b) => b.id === r.badgeId)?.points || 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-celebrate-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <Tag tone="ghost" className="!bg-white/20 !text-white !border-white/30">
              <Trophy size={12} /> Recognition culture
            </Tag>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-3">
              Celebrate great work, every day.
            </h1>
            <p className="text-white/80 mt-2 max-w-xl">
              Send a public kudos with a badge. Recognition powers our leaderboard
              and our culture.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-white text-ink-900 hover:bg-white/90 font-semibold px-5 py-3 rounded-xl inline-flex items-center gap-2 shrink-0"
          >
            <Sparkles size={16} /> Give recognition
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-white/70">Total kudos</p>
            <p className="font-display text-3xl font-bold">{total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-white/70">Total points</p>
            <p className="font-display text-3xl font-bold">{totalPoints}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-white/70">Badge types</p>
            <p className="font-display text-3xl font-bold">{badges.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Badges catalog */}
          <div className="card p-5">
            <SectionHeader
              icon={Award}
              title="Badge catalog"
              subtitle="Pick the right kudo for the moment"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl p-3 border border-ink-100 dark:border-ink-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 text-center"
                >
                  <div className="text-3xl">{b.emoji}</div>
                  <p className="font-semibold text-sm mt-2">{b.name}</p>
                  <p className="text-[11px] muted mt-0.5">+{b.points} pts</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend chart */}
          <div className="card p-5">
            <SectionHeader
              icon={Medal}
              title="Recognition trend"
              subtitle="Posts vs recognitions over the last months"
            />
            <RecognitionTrendChart />
          </div>

          {/* Recent recognitions grid */}
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Recent recognitions"
              subtitle="Share the love"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recognitions.slice(0, 6).map((r) => (
                <RecognitionCard key={r.id} recognition={r} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <LeaderboardWidget limit={8} />
        </div>
      </div>

      <GiveRecognitionModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default Recognition;
