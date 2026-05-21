import { useState } from "react";
import {
  Heart,
  PartyPopper,
  HandHeart,
  MessageCircle,
  Share2,
  Globe2,
  Lock,
  Pin,
  MoreHorizontal,
  Send,
  Flag,
} from "lucide-react";
import useStore from "../../store/useStore";
import Avatar from "../common/Avatar";
import Tag from "../common/Tag";
import { timeAgo, cn } from "../../lib/utils";

const TYPE_META = {
  leadership: { label: "Leadership", tone: "brand" },
  project_win: { label: "Project win", tone: "success" },
  celebration: { label: "Celebration", tone: "accent" },
  footprint: { label: "Department footprint", tone: "ink" },
  announcement: { label: "Announcement", tone: "warning" },
  experience: { label: "Employee experience", tone: "ghost" },
  milestone: { label: "Milestone", tone: "brand" },
};

function FeedCard({ post }) {
  const author = useStore((s) => s.getEmployee(post.authorId));
  const reactPost = useStore((s) => s.reactPost);
  const addComment = useStore((s) => s.addComment);
  const employees = useStore((s) => s.employees);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  const meta = TYPE_META[post.type] || TYPE_META.experience;
  const visAll = !post.visibility || post.visibility.includes("all");

  const contributors = (post.contributors || [])
    .map((id) => employees.find((e) => e.id === id))
    .filter(Boolean);

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    addComment(post.id, draft.trim());
    setDraft("");
  }

  return (
    <article className="card p-5 animate-fade-in">
      {/* Header */}
      <header className="flex items-start gap-3">
        <Avatar name={author?.name} size="md" ring />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-900 dark:text-ink-100">
              {author?.name || "Unknown"}
            </p>
            <span className="text-xs muted">·</span>
            <p className="text-xs muted">{author?.role}</p>
            {post.pinned && (
              <Tag tone="brand" icon={<Pin size={10} />}>Pinned</Tag>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Tag tone={meta.tone}>{meta.label}</Tag>
            {visAll ? (
              <Tag tone="ghost" icon={<Globe2 size={10} />}>Everyone</Tag>
            ) : (
              <Tag tone="ghost" icon={<Lock size={10} />}>
                {post.visibility?.join(" · ")}
              </Tag>
            )}
            <span className="text-xs muted">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button
          className="p-2 rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
          aria-label="More"
        >
          <MoreHorizontal size={16} />
        </button>
      </header>

      {/* Body */}
      <div className="mt-4">
        <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 leading-snug">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300 whitespace-pre-wrap">
          {post.body}
        </p>
      </div>

      {/* Contributors */}
      {contributors.length > 0 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="muted text-xs">With contributions from</span>
          <div className="flex -space-x-2">
            {contributors.slice(0, 5).map((c) => (
              <Avatar key={c.id} name={c.name} size="sm" ring />
            ))}
          </div>
          {contributors.length > 5 && (
            <span className="text-xs muted">+{contributors.length - 5}</span>
          )}
        </div>
      )}

      {/* Reactions */}
      <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => reactPost(post.id, "like")}
          className={cn(
            "btn-ghost !px-3 !py-2 gap-1.5 text-xs",
            post.likedByMe && "text-rose-600",
          )}
        >
          <Heart
            size={14}
            className={post.likedByMe ? "fill-rose-600 text-rose-600" : ""}
          />
          {post.reactions?.like || 0}
        </button>
        <button
          onClick={() => reactPost(post.id, "celebrate")}
          className="btn-ghost !px-3 !py-2 gap-1.5 text-xs"
        >
          <PartyPopper size={14} />
          {post.reactions?.celebrate || 0}
        </button>
        <button
          onClick={() => reactPost(post.id, "support")}
          className="btn-ghost !px-3 !py-2 gap-1.5 text-xs"
        >
          <HandHeart size={14} />
          {post.reactions?.support || 0}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="btn-ghost !px-3 !py-2 gap-1.5 text-xs"
        >
          <MessageCircle size={14} />
          {post.comments?.length || 0} replies
        </button>
        <button className="btn-ghost !px-3 !py-2 gap-1.5 text-xs">
          <Share2 size={14} /> Share
        </button>
        <button
          className="btn-ghost !px-3 !py-2 gap-1.5 text-xs ml-auto text-ink-400"
          aria-label="Flag"
          title="Report"
        >
          <Flag size={14} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {post.comments?.map((c) => (
            <Comment key={c.id} comment={c} />
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-sm muted">Be the first to reply.</p>
          )}
          <CommentInput value={draft} onChange={setDraft} onSubmit={handleSubmit} />
        </div>
      )}
    </article>
  );
}

function Comment({ comment }) {
  const author = useStore((s) => s.getEmployee(comment.authorId));
  return (
    <div className="flex gap-3">
      <Avatar name={author?.name} size="sm" />
      <div className="flex-1 bg-ink-50 dark:bg-ink-800/60 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{author?.name}</p>
          <p className="text-[11px] muted">{timeAgo(comment.createdAt)}</p>
        </div>
        <p className="text-sm text-ink-700 dark:text-ink-300 mt-0.5">
          {comment.body}
        </p>
      </div>
    </div>
  );
}

function CommentInput({ value, onChange, onSubmit }) {
  const me = useStore((s) => s.getCurrentUser());
  return (
    <form onSubmit={onSubmit} className="flex gap-3 items-center">
      <Avatar name={me?.name} size="sm" />
      <div className="flex-1 flex items-center gap-2 bg-ink-50 dark:bg-ink-800/60 rounded-full px-4 py-1.5">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a reply…"
          className="flex-1 bg-transparent outline-none text-sm py-2"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="text-brand-600 disabled:opacity-40"
          aria-label="Post"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}

export default FeedCard;
