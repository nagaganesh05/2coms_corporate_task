import { useMemo, useState } from "react";
import { Trophy, Award, Send, Sparkles, Medal, Check } from "lucide-react";
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

// Minimum chars for a meaningful recognition message. Anything shorter
// is almost certainly noise.
const MIN_MESSAGE_LEN = 10;

function GiveRecognitionModal({ open, onClose }) {
  const employees = useStore((s) => s.employees);
  const me = useStore((s) => s.getCurrentUser());
  const badges = useStore((s) => s.badges);
  const sendRecognition = useStore((s) => s.sendRecognition);

  const [toId, setToId] = useState("");
  // null = "no explicit pick yet"; we fall back to the first badge in
  // render so the default tracks the latest `badges` array without
  // mirroring it into state via an effect.
  const [pickedBadgeId, setPickedBadgeId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const badgeId = pickedBadgeId ?? badges[0]?.id ?? "";
  const setBadgeId = setPickedBadgeId;

  // Live filtered candidate list. NO truncation — the container scrolls.
  const candidates = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return employees
      .filter((e) => e.id !== me?.id)
      .filter((e) => {
        if (!needle) return true;
        return [e.name, e.role, e.email]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      });
  }, [employees, me?.id, search]);

  const selected = useMemo(
    () => (toId ? employees.find((e) => e.id === toId) : null),
    [toId, employees],
  );
  const selectedBadge = useMemo(
    () => badges.find((b) => b.id === badgeId) || null,
    [badges, badgeId],
  );

  const trimmed = message.trim();
  const canSubmit = !!toId && !!badgeId && trimmed.length >= MIN_MESSAGE_LEN;

  function reset() {
    setToId("");
    setPickedBadgeId(null);
    setMessage("");
    setSearch("");
    onClose();
  }

  function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    sendRecognition({ toId, badgeId, message: trimmed });
    toast.success("Recognition sent — kudos shared!");
    reset();
  }

  // Prevent Enter inside the search field from submitting the whole
  // form (which would fire a recognition unintentionally).
  function onSearchKeyDown(e) {
    if (e.key === "Enter") e.preventDefault();
  }

  return (
    <Modal
      open={open}
      onClose={reset}
      title="Send a recognition"
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={reset}
            className="btn-ghost text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="recog-form"
            disabled={!canSubmit}
            className="btn-primary text-sm w-full sm:w-auto"
          >
            <Send size={14} />
            {selectedBadge
              ? `Send ${selectedBadge.name} (+${selectedBadge.points})`
              : "Send recognition"}
          </button>
        </>
      }
    >
      <form id="recog-form" onSubmit={submit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Recognize
          </label>

          {selected && (
            <div className="mb-2 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={selected.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {selected.name}
                  </p>
                  <p className="text-[11px] muted truncate">{selected.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToId("")}
                className="text-xs muted hover:text-ink-900 dark:hover:text-ink-100"
              >
                Change
              </button>
            </div>
          )}

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Search by name, role or email…"
            className="input"
            aria-label="Search colleagues"
          />
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {candidates.length === 0 ? (
              <p className="col-span-full text-center text-xs muted py-4">
                No colleagues match — try a different search.
              </p>
            ) : (
              candidates.map((e) => {
                const isSelected = toId === e.id;
                return (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setToId(e.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-xl border transition text-left",
                      isSelected
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800",
                    )}
                  >
                    <Avatar name={e.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{e.name}</p>
                      <p className="text-[11px] muted truncate">{e.role}</p>
                    </div>
                    {isSelected && (
                      <Check size={14} className="text-brand-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Pick a badge
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((b) => {
              const isSelected = badgeId === b.id;
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBadgeId(b.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "p-3 rounded-xl border text-left transition",
                    isSelected
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800",
                  )}
                >
                  <div className="text-2xl">{b.emoji}</div>
                  <p className="text-xs font-semibold mt-1">{b.name}</p>
                  <p className="text-[11px] muted">+{b.points} points</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block" htmlFor="recog-message">
            Why?
          </label>
          <textarea
            id="recog-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Be specific — share what they did and the impact."
            className="input min-h-[100px] resize-y"
            maxLength={400}
            aria-describedby="recog-message-hint"
          />
          <p
            id="recog-message-hint"
            className={cn(
              "text-[11px] mt-1",
              trimmed.length > 0 && trimmed.length < MIN_MESSAGE_LEN
                ? "text-rose-600"
                : "muted",
            )}
          >
            {trimmed.length < MIN_MESSAGE_LEN
              ? `At least ${MIN_MESSAGE_LEN} characters · ${message.length}/400`
              : `${message.length}/400`}
          </p>
        </div>
      </form>
    </Modal>
  );
}

function Recognition() {
  const recognitions = useStore((s) => s.recognitions);
  const badges = useStore((s) => s.badges);
  const [open, setOpen] = useState(false);

  // Pre-build a badge -> points lookup so total points + recent
  // recognitions don't do a linear find() per item.
  const badgePointsById = useMemo(() => {
    const m = new Map();
    for (const b of badges) m.set(b.id, b.points || 0);
    return m;
  }, [badges]);

  const total = recognitions.length;
  const totalPoints = useMemo(
    () => recognitions.reduce((a, r) => a + (badgePointsById.get(r.badgeId) || 0), 0),
    [recognitions, badgePointsById],
  );

  // Always render newest first.
  const recent = useMemo(
    () =>
      recognitions
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [recognitions],
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
              Send a public kudos with a badge. Recognition powers our
              leaderboard and our culture.
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
            <p className="text-xs uppercase tracking-wider text-white/70">
              Total kudos
            </p>
            <p className="font-display text-3xl font-bold">{total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-white/70">
              Total points
            </p>
            <p className="font-display text-3xl font-bold">{totalPoints}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-white/70">
              Badge types
            </p>
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
              {recent.map((r) => (
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
