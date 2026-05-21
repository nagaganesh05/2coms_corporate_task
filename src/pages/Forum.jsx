import { useState } from "react";
import { MessagesSquare, Plus, Send, Heart, Flag } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import ForumThreadCard from "../components/cards/ForumThreadCard";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import { timeAgo } from "../lib/utils";

function NewThreadModal({ open, onClose }) {
  const addForumThread = useStore((s) => s.addForumThread);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addForumThread({
      title: title.trim(),
      body: body.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
    });
    toast.success("Thread posted");
    setTitle("");
    setBody("");
    setTags("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Start a new thread" size="md">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Question or topic</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="What do you want to discuss?"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Details</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input min-h-[120px] resize-y"
            placeholder="Add context, what you tried, how you’re thinking…"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Tags <span className="muted text-xs">(comma separated)</span>
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
            placeholder="culture, hybrid, ai"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !body.trim()}
            className="btn-primary text-sm"
          >
            <Send size={14} /> Post thread
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ThreadDetail({ thread, onClose }) {
  const replyThread = useStore((s) => s.replyThread);
  const likeThread = useStore((s) => s.likeThread);
  const flagThread = useStore((s) => s.flagThread);
  const getEmployee = useStore((s) => s.getEmployee);
  const author = getEmployee(thread?.authorId);
  const [draft, setDraft] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    replyThread(thread.id, draft.trim());
    setDraft("");
  }

  if (!thread) return null;

  return (
    <Modal open={!!thread} onClose={onClose} title="Thread" size="lg">
      <div className="flex items-start gap-3">
        <Avatar name={author?.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{author?.name}</p>
            <span className="text-xs muted">· {timeAgo(thread.createdAt)}</span>
          </div>
          <h2 className="mt-1 font-display font-bold text-lg">{thread.title}</h2>
          <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{thread.body}</p>
          {thread.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {thread.tags.map((t) => (
                <Tag key={t} tone="ghost">#{t}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <button
          onClick={() => likeThread(thread.id)}
          className="inline-flex items-center gap-1.5 hover:text-rose-600 muted"
        >
          <Heart size={12} /> {thread.likes}
        </button>
        <button
          onClick={() => {
            flagThread(thread.id);
            toast("Thread flagged for moderation", { icon: "⚑" });
          }}
          className="inline-flex items-center gap-1.5 hover:text-warning-600 muted"
        >
          <Flag size={12} /> Report
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100 dark:border-ink-800">
        <p className="text-xs uppercase tracking-wider muted font-semibold mb-3">
          {thread.replies?.length || 0} replies
        </p>
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {thread.replies?.map((r) => {
            const a = getEmployee(r.authorId);
            return (
              <div key={r.id} className="flex items-start gap-3">
                <Avatar name={a?.name} size="sm" />
                <div className="flex-1 bg-ink-50 dark:bg-ink-800/60 rounded-2xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{a?.name}</p>
                    <p className="text-[11px] muted">{timeAgo(r.createdAt)}</p>
                  </div>
                  <p className="text-sm mt-0.5 text-ink-700 dark:text-ink-300">
                    {r.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="input flex-1"
            placeholder="Write a reply…"
          />
          <button type="submit" className="btn-primary" disabled={!draft.trim()}>
            <Send size={14} /> Reply
          </button>
        </form>
      </div>
    </Modal>
  );
}

function Forum() {
  const threads = useStore((s) => s.forumThreads);
  const [active, setActive] = useState(null);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            Community forum
          </h1>
          <p className="muted text-sm">
            Two-way conversations across the company. Post a question, share an experience, or rally a team.
          </p>
        </div>
        <button onClick={() => setNewOpen(true)} className="btn-primary text-sm">
          <Plus size={14} /> New thread
        </button>
      </div>

      {threads.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No threads yet"
          hint="Be the first to spark a conversation."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {threads.map((t) => (
            <ForumThreadCard key={t.id} thread={t} onOpen={setActive} />
          ))}
        </div>
      )}

      <ThreadDetail thread={active} onClose={() => setActive(null)} />
      <NewThreadModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}

export default Forum;
