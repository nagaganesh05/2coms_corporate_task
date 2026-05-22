import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Sparkles,
  Pencil,
  Save,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import Modal from "../components/common/Modal";
import RecognitionCard from "../components/cards/RecognitionCard";
import FeedCard from "../components/cards/FeedCard";
import SectionHeader from "../components/common/SectionHeader";
import { formatDate } from "../lib/utils";

function EditProfileModal({ open, onClose, me }) {
  const updateMyProfile = useStore((s) => s.updateMyProfile);
  const [bio, setBio] = useState(me?.bio || "");
  const [skills, setSkills] = useState((me?.skills || []).join(", "));

  function submit(e) {
    e.preventDefault();
    const cleanedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateMyProfile({ bio: bio.trim(), skills: cleanedSkills });
    toast.success("Profile updated");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit your profile" size="md">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60">
          <Avatar name={me?.name} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-sm">{me?.name}</p>
            <p className="text-xs muted">
              Name, role and department are managed by HR.
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">Short bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A line or two that helps colleagues know what you’re into."
            className="input min-h-[100px] resize-y"
            maxLength={240}
          />
          <p className="text-[11px] muted mt-1 text-right">{bio.length}/240</p>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Skills <span className="muted text-xs">(comma separated)</span>
          </label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Tailwind, Storytelling"
            className="input"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button type="submit" className="btn-primary text-sm">
            <Save size={14} /> Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Profile() {
  // Subscribe to raw arrays only — never derive (.filter / .map) inside the
  // useStore selector, that returns a new reference every render and
  // triggers an infinite useSyncExternalStore loop.
  const me = useStore((s) => s.getCurrentUser());
  const dept = useStore((s) => s.getDepartment(me?.departmentId));
  const allRecognitions = useStore((s) => s.recognitions);
  const allPosts = useStore((s) => s.posts);
  const badges = useStore((s) => s.badges);

  const [editOpen, setEditOpen] = useState(false);

  const recognitions = useMemo(
    () => allRecognitions.filter((r) => r.toId === me?.id),
    [allRecognitions, me?.id],
  );
  const myPosts = useMemo(
    () => allPosts.filter((p) => p.authorId === me?.id),
    [allPosts, me?.id],
  );
  const totalPoints = useMemo(
    () =>
      recognitions.reduce(
        (a, r) => a + (badges.find((b) => b.id === r.badgeId)?.points || 0),
        0,
      ),
    [recognitions, badges],
  );

  // Engagement totals across the user's posts (a nicer "alive" stat than 0/0)
  const engagement = useMemo(
    () =>
      myPosts.reduce(
        (sum, p) =>
          sum +
          (p.reactions?.like || 0) +
          (p.reactions?.celebrate || 0) +
          (p.reactions?.support || 0),
        0,
      ),
    [myPosts],
  );

  if (!me) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card overflow-hidden">
        {/* ---------- Cover banner ----------
            Compact (h-28) with a tasteful radial-glow + dot grid so it
            doesn't feel like dead space. The Edit button floats top-right. */}
        <div className="relative h-28 bg-hero-gradient overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.45), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25), transparent 40%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <button
            onClick={() => setEditOpen(true)}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            <Pencil size={12} /> Edit profile
          </button>
        </div>

        {/* ---------- Identity row ----------
            Grid layout instead of flex-wrap — keeps the avatar + name on the
            left, stats on the right, and gracefully stacks on mobile. */}
        <div className="px-6 pb-6 -mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
          <div className="flex items-end gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Avatar
                name={me.name}
                size="2xl"
                ring
                className="border-4 border-white dark:border-ink-900 shadow-lg"
              />
            </motion.div>
            <div className="min-w-0 pb-1">
              <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100 truncate">
                {me.name}
              </h1>
              <p className="muted truncate">{me.role}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tag tone="brand">{dept?.name}</Tag>
                <Tag tone="ghost" icon={<MapPin size={10} />}>
                  {me.location}
                </Tag>
                <Tag tone="ghost" icon={<Calendar size={10} />}>
                  Joined{" "}
                  {formatDate(me.joinDate, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Tag>
              </div>
            </div>
          </div>

          {/* Stats — three tight tiles, always aligned to the right on md+ */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-3 gap-2 md:flex md:gap-3"
          >
            {[
              {
                label: "Recognitions",
                value: recognitions.length,
                tone: "brand",
              },
              {
                label: "Points",
                value: totalPoints,
                tone: "accent",
              },
              {
                label: "Engagement",
                value: engagement,
                tone: "success",
              },
            ].map(({ label, value, tone }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.25 },
                  },
                }}
                className="card p-3 text-center min-w-[90px]"
              >
                <p className="text-[11px] muted">{label}</p>
                <p
                  className={
                    "font-display text-xl sm:text-2xl font-bold tabular-nums " +
                    (tone === "accent"
                      ? "text-accent-600 dark:text-accent-400"
                      : tone === "success"
                        ? "text-success-600 dark:text-success-500"
                        : "text-ink-900 dark:text-ink-100")
                  }
                >
                  {value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ---------- Bio + skills + email ---------- */}
        <div className="px-6 pb-6 space-y-4">
          {me.bio ? (
            <p className="text-sm text-ink-700 dark:text-ink-300 max-w-2xl">
              {me.bio}
            </p>
          ) : (
            <button
              onClick={() => setEditOpen(true)}
              className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1.5"
            >
              <Pencil size={12} /> Add a short bio so colleagues can find you
            </button>
          )}

          {me.skills?.length > 0 && (
            <div>
              <p className="text-xs muted uppercase tracking-wider font-semibold">
                Skills
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {me.skills.map((s) => (
                  <Tag key={s} tone="ink">
                    {s}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          <a
            href={`mailto:${me.email}`}
            className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1.5"
          >
            <Mail size={14} /> {me.email}
          </a>
        </div>
      </div>

      {/* ---------- Posts + recognitions ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Posts I have shared"
              subtitle={`${myPosts.length} update${myPosts.length === 1 ? "" : "s"} from you`}
            />
            {myPosts.length === 0 ? (
              <div className="card p-8 text-center">
                <Sparkles size={20} className="mx-auto text-ink-400" />
                <p className="text-sm font-semibold mt-3 text-ink-800 dark:text-ink-100">
                  Nothing shared yet
                </p>
                <p className="text-xs muted mt-1">
                  Share a project win, a learning, or a celebration on the feed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((p) => (
                  <FeedCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader
              icon={Trophy}
              title="Recognitions received"
              subtitle="Public kudos from colleagues"
            />
            {recognitions.length === 0 ? (
              <div className="card p-6 text-center">
                <Award size={20} className="mx-auto text-ink-400" />
                <p className="text-sm font-semibold mt-3 text-ink-800 dark:text-ink-100">
                  No recognitions yet
                </p>
                <p className="text-xs muted mt-1">
                  When colleagues recognize your work, it shows up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recognitions.slice(0, 5).map((r) => (
                  <RecognitionCard key={r.id} recognition={r} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        me={me}
      />
    </div>
  );
}

export default Profile;
