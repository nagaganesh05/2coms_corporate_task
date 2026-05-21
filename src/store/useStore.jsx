import { create } from "zustand";
import { uid } from "../lib/utils";
import {
  verticals,
  departments,
  employees,
  leadershipMessages,
  leadershipMeets,
  milestones,
  footprints,
  posts,
  badges,
  recognitions,
  events,
  polls,
  knowledgeDocs,
  galleryPhotos,
  galleryVideos,
  forumThreads,
  notifications,
  moderationQueue,
  engagementMonthly,
  departmentDistribution,
  buildEngagementHeatmap,
} from "./seed";

// ---------------------------------------------------------------------------
// Persistence helpers (lightweight – we just persist auth + theme)
// ---------------------------------------------------------------------------
const ROLE_KEY = "ci.role";
const USER_KEY = "ci.userId";
const TENANT_KEY = "ci.tenantScope";
const THEME_KEY = "ci.theme";

const safeGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    // ignore
  }
};
const safeDel = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {
    // ignore
  }
};

const persistedRole = safeGet(ROLE_KEY); // "employee" | "hr" | "admin"
const persistedUserId = safeGet(USER_KEY) || (persistedRole === "admin" ? "e2" : "e4");
const persistedTenant = safeGet(TENANT_KEY); // JSON list of dept ids or "all"
const persistedTheme = safeGet(THEME_KEY); // "light" | "dark"

// Apply theme class on load
if (typeof document !== "undefined") {
  document.documentElement.classList.toggle("dark", persistedTheme === "dark");
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
const useStore = create((set, get) => ({
  // -------- Reference data --------
  verticals,
  departments,
  employees,
  badges,

  // -------- Content --------
  leadershipMessages,
  leadershipMeets,
  milestones,
  footprints,
  posts,
  recognitions,
  events,
  polls,
  knowledgeDocs,
  galleryPhotos,
  galleryVideos,
  forumThreads,
  notifications,
  moderationQueue,
  engagementMonthly,
  departmentDistribution,
  engagementHeatmap: buildEngagementHeatmap(),

  // -------- Auth / theme --------
  currentUserId: persistedUserId,
  role: persistedRole || null, // null means logged out
  tenantScope: persistedTenant ? JSON.parse(persistedTenant) : "all",
  theme: persistedTheme || "light",

  // ----------------------------------------------------------------------
  // Selectors
  // ----------------------------------------------------------------------
  getCurrentUser: () => {
    const { currentUserId, employees: emp } = get();
    return emp.find((e) => e.id === currentUserId) || emp[0];
  },
  getEmployee: (id) => get().employees.find((e) => e.id === id),
  getDepartment: (id) => get().departments.find((d) => d.id === id),
  getVertical: (id) => get().verticals.find((v) => v.id === id),
  getBadge: (id) => get().badges.find((b) => b.id === id),

  // Visibility-aware feed for the current user
  getVisiblePosts: () => {
    const { posts: list, currentUserId, employees: emp, role } = get();
    const me = emp.find((e) => e.id === currentUserId);
    const myDept = me?.departmentId;
    return list.filter((p) => {
      if (!p.visibility || p.visibility.includes("all")) return true;
      if (role === "admin") return true; // admins see everything
      return p.visibility.includes(myDept);
    });
  },

  // Leaderboard derived from recognitions
  getLeaderboard: (limit = 10) => {
    const { recognitions: recs, badges: bg, employees: emp } = get();
    const map = new Map();
    for (const r of recs) {
      const points = bg.find((b) => b.id === r.badgeId)?.points || 0;
      const cur = map.get(r.toId) || { id: r.toId, points: 0, count: 0 };
      cur.points += points;
      cur.count += 1;
      map.set(r.toId, cur);
    }
    return Array.from(map.values())
      .map((row) => ({
        ...row,
        employee: emp.find((e) => e.id === row.id),
      }))
      .filter((row) => row.employee)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  },

  // Birthdays in the next N days
  getUpcomingBirthdays: (days = 30) => {
    const today = new Date();
    return get()
      .employees.map((e) => {
        if (!e.dob) return null;
        const dob = new Date(e.dob);
        const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        const diff = Math.round((next - today) / 86_400_000);
        return diff <= days ? { employee: e, in: diff, on: next } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.in - b.in);
  },

  // Joinees in last N days
  getNewJoinees: (days = 60) => {
    const cutoff = Date.now() - days * 86_400_000;
    return get()
      .employees.filter((e) => new Date(e.joinDate).getTime() >= cutoff)
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
  },

  // Department impact in the last N days based on posts of type project_win/footprint/milestone
  getDepartmentImpact: () => {
    const { posts: list, departments: deps } = get();
    return deps.map((d) => {
      const count = list.filter(
        (p) =>
          ["project_win", "footprint", "milestone"].includes(p.type) &&
          (p.visibility?.includes("all") ||
            p.visibility?.includes(d.id) ||
            p.authorId &&
              get().getEmployee(p.authorId)?.departmentId === d.id),
      ).length;
      return { departmentId: d.id, name: d.name, count };
    });
  },

  // ----------------------------------------------------------------------
  // Auth actions
  // ----------------------------------------------------------------------
  login: ({ role, userId }) => {
    safeSet(ROLE_KEY, role);
    safeSet(USER_KEY, userId);
    set({ role, currentUserId: userId });
  },
  logout: () => {
    safeDel(ROLE_KEY);
    safeDel(USER_KEY);
    safeDel(TENANT_KEY);
    set({ role: null });
  },
  setTenantScope: (scope) => {
    safeSet(TENANT_KEY, JSON.stringify(scope));
    set({ tenantScope: scope });
  },

  // ----------------------------------------------------------------------
  // Theme actions
  // ----------------------------------------------------------------------
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      safeSet(THEME_KEY, next);
      if (typeof document !== "undefined")
        document.documentElement.classList.toggle("dark", next === "dark");
      return { theme: next };
    }),
  // Backward compatibility for older Settings code
  toggleDarkMode: () => get().toggleTheme(),

  // ----------------------------------------------------------------------
  // Feed / posts actions
  // ----------------------------------------------------------------------
  addPost: ({ type = "experience", title, body, visibility = ["all"] }) => {
    const me = get().getCurrentUser();
    const post = {
      id: `p_${uid()}`,
      type,
      authorId: me.id,
      title,
      body,
      visibility,
      createdAt: new Date().toISOString(),
      reactions: { like: 0, celebrate: 0, support: 0 },
      likedByMe: false,
      comments: [],
    };
    set((s) => ({ posts: [post, ...s.posts] }));
    return post;
  },

  reactPost: (postId, kind = "like") =>
    set((s) => ({
      posts: s.posts.map((p) => {
        if (p.id !== postId) return p;
        const next = { ...p.reactions };
        if (kind === "like") {
          if (p.likedByMe) next.like = Math.max(0, (next.like || 0) - 1);
          else next.like = (next.like || 0) + 1;
          return { ...p, reactions: next, likedByMe: !p.likedByMe };
        }
        next[kind] = (next[kind] || 0) + 1;
        return { ...p, reactions: next };
      }),
    })),

  addComment: (postId, body) => {
    const me = get().getCurrentUser();
    const comment = {
      id: `c_${uid()}`,
      authorId: me.id,
      body,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
      ),
    }));
    return comment;
  },

  // ----------------------------------------------------------------------
  // Recognition
  // ----------------------------------------------------------------------
  sendRecognition: ({ toId, badgeId, message }) => {
    const me = get().getCurrentUser();
    const rec = {
      id: `r_${uid()}`,
      fromId: me.id,
      toId,
      badgeId,
      message,
      createdAt: new Date().toISOString(),
    };
    const recipient = get().getEmployee(toId);
    set((s) => ({
      recognitions: [rec, ...s.recognitions],
      notifications: [
        {
          id: `n_${uid()}`,
          type: "recognition",
          message: `${me.name} recognized ${recipient?.name || "a colleague"}.`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    }));
    return rec;
  },

  // ----------------------------------------------------------------------
  // Polls
  // ----------------------------------------------------------------------
  votePoll: (pollId, optionId) =>
    set((s) => ({
      polls: s.polls.map((p) => {
        if (p.id !== pollId || p.voted) return p;
        return {
          ...p,
          voted: optionId,
          options: p.options.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
          ),
        };
      }),
    })),

  // ----------------------------------------------------------------------
  // Events
  // ----------------------------------------------------------------------
  rsvpEvent: (eventId) =>
    set((s) => ({
      events: s.events.map((e) =>
        e.id === eventId
          ? { ...e, rsvp: (e.rsvp || 0) + 1, rsvpedByMe: true }
          : e,
      ),
    })),

  // ----------------------------------------------------------------------
  // Forum
  // ----------------------------------------------------------------------
  addForumThread: ({ title, body, tags = [] }) => {
    const me = get().getCurrentUser();
    const t = {
      id: `t_${uid()}`,
      title,
      body,
      authorId: me.id,
      departmentId: me.departmentId,
      createdAt: new Date().toISOString(),
      likes: 0,
      flagged: false,
      tags,
      replies: [],
    };
    set((s) => ({ forumThreads: [t, ...s.forumThreads] }));
    return t;
  },
  replyThread: (threadId, body) => {
    const me = get().getCurrentUser();
    const reply = {
      id: `tr_${uid()}`,
      authorId: me.id,
      body,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      forumThreads: s.forumThreads.map((t) =>
        t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t,
      ),
    }));
    return reply;
  },
  likeThread: (threadId) =>
    set((s) => ({
      forumThreads: s.forumThreads.map((t) =>
        t.id === threadId ? { ...t, likes: (t.likes || 0) + 1 } : t,
      ),
    })),
  flagThread: (threadId) =>
    set((s) => ({
      forumThreads: s.forumThreads.map((t) =>
        t.id === threadId ? { ...t, flagged: true } : t,
      ),
      moderationQueue: [
        {
          id: `mq_${uid()}`,
          type: "forum",
          authorId: s.forumThreads.find((t) => t.id === threadId)?.authorId,
          title: s.forumThreads.find((t) => t.id === threadId)?.title,
          body: s.forumThreads.find((t) => t.id === threadId)?.body,
          createdAt: new Date().toISOString(),
          status: "flagged",
          reason: "Reported by a colleague",
        },
        ...s.moderationQueue,
      ],
    })),

  // ----------------------------------------------------------------------
  // Notifications
  // ----------------------------------------------------------------------
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  // ----------------------------------------------------------------------
  // Moderation
  // ----------------------------------------------------------------------
  approveModeration: (id) =>
    set((s) => ({
      moderationQueue: s.moderationQueue.map((m) =>
        m.id === id ? { ...m, status: "approved" } : m,
      ),
    })),
  rejectModeration: (id) =>
    set((s) => ({
      moderationQueue: s.moderationQueue.map((m) =>
        m.id === id ? { ...m, status: "rejected" } : m,
      ),
    })),

  // ----------------------------------------------------------------------
  // Admin: publish announcements / leadership messages
  // ----------------------------------------------------------------------
  publishAnnouncement: ({ title, body, visibility = ["all"], priority = "medium" }) => {
    const me = get().getCurrentUser();
    const post = {
      id: `p_${uid()}`,
      type: "announcement",
      authorId: me.id,
      title,
      body,
      visibility,
      priority,
      createdAt: new Date().toISOString(),
      reactions: { like: 0, celebrate: 0, support: 0 },
      comments: [],
    };
    set((s) => ({ posts: [post, ...s.posts] }));
    return post;
  },

  publishLeadershipMessage: ({ title, body }) => {
    const me = get().getCurrentUser();
    const lm = {
      id: `lm_${uid()}`,
      authorId: me.id,
      title,
      body,
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    set((s) => ({
      leadershipMessages: [lm, ...s.leadershipMessages],
    }));
    return lm;
  },

  publishMilestone: ({ title, body, departmentId }) => {
    const ms = {
      id: `ms_${uid()}`,
      title,
      body,
      date: new Date().toISOString(),
      departmentId,
    };
    set((s) => ({ milestones: [ms, ...s.milestones] }));
    return ms;
  },
}));

export default useStore;
