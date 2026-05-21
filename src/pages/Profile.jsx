import { Mail, MapPin, Calendar, Trophy, Sparkles } from "lucide-react";
import useStore from "../store/useStore";
import Avatar from "../components/common/Avatar";
import Tag from "../components/common/Tag";
import RecognitionCard from "../components/cards/RecognitionCard";
import FeedCard from "../components/cards/FeedCard";
import SectionHeader from "../components/common/SectionHeader";
import { formatDate } from "../lib/utils";

function Profile() {
  const me = useStore((s) => s.getCurrentUser());
  const dept = useStore((s) => s.getDepartment(me?.departmentId));
  const recognitions = useStore((s) =>
    s.recognitions.filter((r) => r.toId === me?.id),
  );
  const myPosts = useStore((s) => s.posts.filter((p) => p.authorId === me?.id));
  const badges = useStore((s) => s.badges);

  const totalPoints = recognitions.reduce(
    (a, r) => a + (badges.find((b) => b.id === r.badgeId)?.points || 0),
    0,
  );

  if (!me) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card overflow-hidden">
        <div className="h-32 bg-hero-gradient" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="flex items-end gap-4">
              <Avatar name={me.name} size="2xl" ring className="border-4 border-white dark:border-ink-900" />
              <div>
                <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
                  {me.name}
                </h1>
                <p className="muted">{me.role}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Tag tone="brand">{dept?.name}</Tag>
                  <Tag tone="ghost" icon={<MapPin size={10} />}>{me.location}</Tag>
                  <Tag tone="ghost" icon={<Calendar size={10} />}>
                    Joined {formatDate(me.joinDate, { day: "numeric", month: "short", year: "numeric" })}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="card p-3 text-center min-w-[110px]">
                <p className="text-xs muted">Recognitions</p>
                <p className="font-display text-2xl font-bold">{recognitions.length}</p>
              </div>
              <div className="card p-3 text-center min-w-[110px]">
                <p className="text-xs muted">Points</p>
                <p className="font-display text-2xl font-bold text-accent-600">{totalPoints}</p>
              </div>
            </div>
          </div>

          {me.bio && (
            <p className="mt-5 text-sm text-ink-700 dark:text-ink-300 max-w-2xl">
              {me.bio}
            </p>
          )}

          {me.skills?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs muted uppercase tracking-wider font-semibold">Skills</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {me.skills.map((s) => (
                  <Tag key={s} tone="ink">{s}</Tag>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <a
              href={`mailto:${me.email}`}
              className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1.5"
            >
              <Mail size={14} /> {me.email}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Posts I have shared"
              subtitle={`${myPosts.length} updates from you`}
            />
            <div className="space-y-4">
              {myPosts.length === 0 && (
                <p className="text-sm muted">You haven’t posted yet — share an update on the feed.</p>
              )}
              {myPosts.map((p) => (
                <FeedCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader
              icon={Trophy}
              title="Recognitions received"
              subtitle="Public kudos from colleagues"
            />
            <div className="space-y-4">
              {recognitions.length === 0 && (
                <p className="text-sm muted">No recognitions yet.</p>
              )}
              {recognitions.slice(0, 4).map((r) => (
                <RecognitionCard key={r.id} recognition={r} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
