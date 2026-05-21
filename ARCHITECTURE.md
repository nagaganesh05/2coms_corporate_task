# CorpConnect — Architecture & Design Notes

CorpConnect is a structured **internal engagement & communication layer** for an entire organization — built so it can later be embedded inside a larger app or stand on its own. This document captures the schema, the data flow, the modular architecture, the visual system, and the prioritization rules that drove every UX decision.

## 1. Product principles

1. **Simple yet powerful.** Every screen has one or two primary actions and a clear hierarchy. Optional density is opt-in (filters, expanding comments, modals).
2. **Visibility with control.** Every post carries a visibility scope. Multi-tenancy is data-driven, not hard-coded.
3. **Celebration as a habit.** Recognition, gamification and the leaderboard are first-class — not a settings tab.
4. **Two-way, not broadcast-only.** Forum, comments, replies, polls, RSVPs, reactions — every surface invites response.
5. **Modularity.** Cards, widgets and charts are self-contained and store-aware so any page can be rearranged without breaking layout.
6. **Mobile is a focused experience.** The web app has the full surface area; the APK exposes the engagement-critical subset (Home / Feed / Praise / People / Events).

## 2. Tech choices

| Layer            | Choice                                                                |
|------------------|-----------------------------------------------------------------------|
| Build            | Vite + React 19                                                       |
| Styling          | Tailwind CSS (dark-mode class) + Inter / Plus Jakarta Sans            |
| State            | Zustand (single store, persisted auth + theme via localStorage)       |
| Routing          | React Router v7 with role-aware `ProtectedRoute`                      |
| Charts           | Recharts                                                              |
| Carousels        | Swiper                                                                |
| Animations       | Framer Motion                                                         |
| Toasts           | react-hot-toast                                                       |
| Mobile shell     | Capacitor (Android), `MobileBottomNav` for the limited mobile feature set |

## 3. Information architecture

```
/                       Dashboard (priority layout)
/feed                   Org-wide feed (composer + filters + comments)
/recognition            Send praise, badges, gamified leaderboard
/forum                  Threaded community discussion
/directory              Company-wide people search
/teams                  Verticals → Departments
/events                 Engagement calendar + RSVP
/knowledge              Handbooks, policies, runbooks (categorized)
/gallery                Photos & videos from events
/notifications          Filtered notification list
/settings               Theme, alerts, profile shortcut
/profile                Personal page (recognitions + posts)

# Role-gated (admin or hr)
/admin                  Command center
/admin/content          Publish announcements / leadership messages / milestones
/admin/moderation       Approve / reject queue with status filters
/admin/analytics        Engagement, distribution, impact, top contributors
```

## 4. Data model (schema)

The frontend is bound to a single Zustand store but the **schema is intentionally backend-shaped** so the same shapes can be served by a relational or document database with no UI churn.

### Core tables

```
verticals      (id, name, color)
departments    (id, name, vertical_id → verticals.id, lead_id → employees.id)
employees      (id, name, role, department_id → departments.id, location,
                skills[], join_date, dob, email, manager_id, bio)

posts          (id, type, author_id, title, body, visibility[],
                pinned, priority, contributors[], reactions{},
                created_at)
comments       (id, post_id → posts.id, author_id, body, created_at)

leadership_messages (id, author_id, title, body, pinned, created_at)
leadership_meets    (id, month, headline, outcomes[], next_steps[], created_at)
milestones          (id, title, body, department_id, date)
footprints          (department_id, impact, metric, delta, blurb)

badges          (id, name, emoji, points)
recognitions    (id, from_id, to_id, badge_id → badges.id, message, created_at)

events          (id, title, type, date, location, description, rsvp,
                 department_id)
polls           (id, question, options[{id, text, votes}], voted, closes_at)

knowledge_docs  (id, title, category, type, owner_id, updated_at, size)
gallery_photos  (id, url, title, event)
gallery_videos  (id, thumb, title, duration)

forum_threads   (id, title, body, author_id, department_id, created_at,
                 likes, flagged, tags[], replies[{id, author_id, body, created_at}])

notifications   (id, type, message, created_at, read)

moderation_queue (id, type, author_id, title, body, status, reason, created_at)
```

### Multi-tenancy / visibility

`posts.visibility` is a string array — either `["all"]` or a list of `department_id`s. The selector `getVisiblePosts()` enforces this on every page that renders posts, while admins always see everything.

```js
// Pseudo-SQL of what the API would do
SELECT * FROM posts
WHERE 'all' = ANY(visibility)
   OR :role = 'admin'
   OR :user.department_id = ANY(visibility);
```

This same pattern can be extended for:
- BU-level isolation (HR can scope to a BU using `ScopeSelector`).
- Geography / legal entity (just another id in `visibility`).
- Time-bounded visibility (add `visible_from/visible_until`).

### Engagement signals (analytics)

| Signal              | Source                                       | Used in                          |
|---------------------|----------------------------------------------|----------------------------------|
| Engagement score    | `engagementMonthly`                          | Dashboard, AdminDashboard, Analytics |
| Posts vs recognitions | `engagementMonthly.posts/recognitions`     | Analytics                        |
| Department distribution | `departmentDistribution`                | Analytics                        |
| Department impact   | derived from posts of type project_win/footprint/milestone via `getDepartmentImpact()` | Analytics, AdminDashboard |
| Heatmap density     | `engagementHeatmap` (84-day grid)            | EngagementCalendar               |
| Leaderboard points  | derived from `recognitions × badges.points`  | Recognition, Dashboard, AdminDashboard, Analytics |

## 5. State & data flow

```
seed.js  ─────►  useStore.jsx (Zustand)  ─────►  components & pages
                       │
                       ├── selectors (visibility-aware getters)
                       ├── auth (login/logout, role, currentUserId)
                       │   ↑ persisted to localStorage (role, userId, scope, theme)
                       ├── theme (toggleTheme — toggles `.dark` on <html>)
                       └── actions (addPost, reactPost, addComment, sendRecognition,
                                    rsvpEvent, votePoll, addForumThread, replyThread,
                                    flagThread, mark*Read, approve/reject moderation,
                                    publish*)
```

Replacing the seed with a backend is a one-file change — every action and selector has an obvious server analogue.

## 6. Modularity

```
src/
├── components/
│   ├── cards/          presentational, takes data as props (no global I/O)
│   ├── widgets/        composes cards + reads/writes the store
│   ├── charts/         pure recharts wrappers, theme-bound colors
│   └── common/         primitives shared everywhere (Avatar, Tag, Modal, …)
├── layouts/            shell (Sidebar + Navbar + Outlet + MobileBottomNav)
├── pages/              employee + admin pages (composition only)
├── routes/             AppRoutes (role-aware)
├── store/              seed.js + useStore.jsx (single source of truth)
├── lib/                tiny helpers (cn, initials, avatarGradient, timeAgo, formatDate)
```

Three rules keep modularity tight:

1. **Cards are dumb.** They take data as props.
2. **Widgets connect to the store.** Pages compose widgets — they don’t reach into the store directly except for high-level composition.
3. **Pages are layout only.** No business logic in pages. This is what lets the dashboard rearrange itself without breaking anything.

## 7. Theming & visual system

- **Brand:** `brand` indigo for trust + product, `accent` orange for celebration & recognition (used on the Recognition hero, badges, RecognitionCard gradient).
- **Neutral:** custom `ink` ramp 50→950 used everywhere for surfaces and text — this is what makes light + dark feel like one system.
- **Semantic:** `success`, `warning`, `danger` for status (announcement priority, moderation status, deltas).
- **Vertical color identity:** every business vertical (Technology, Business, Operations, People & Culture) has a gradient that runs across `FootprintCard`, `Teams` cards and supporting glyphs — so users learn the colors of their org.
- **Gradients:**
  - `brand-gradient` — primary brand surfaces.
  - `celebrate-gradient` — recognition.
  - `hero-gradient` — leadership / login backdrop.
- **Type pairing:** Inter for body, Plus Jakarta Sans for display (`font-display`).
- **Component utilities:** `.card`, `.btn-primary/.btn-ghost/.btn-outline`, `.input`, `.chip`, `.section-title`, `.muted` — defined once in `index.css`.
- **Dark mode:** class-based; toggling sets `.dark` on `<html>` and persists to localStorage. Charts use a small ink-aware palette so they read well in both modes.

## 8. Prioritization model (Dashboard)

The Dashboard isn’t a kitchen sink — it follows a deliberate priority gradient.

```
1. Vision / Leadership                 (HeroCarousel)
2. Pulse KPIs                          (StatsCards)
3. Engagement chart + Leadership msg   (signal + voice)
4. Leadership Meet outcomes            (so people know what changed)
5. Recognition Spotlight + Poll        (celebration + voice)
6. New Joinees                         (welcome / inclusion)
7. Department Footprints               (visible impact across teams)
8. Engagement Calendar + Leaderboard + Birthdays (rhythm + recognition)
9. Milestones + Quick Actions + Latest Feed link  (momentum + go-deeper)
```

Every section is a self-contained widget. HR/Admins can swap the order in the future without breaking anything else.

## 9. Recognition culture (gamification)

- 5 badge archetypes (`Innovation Star`, `Customer Champion`, `Culture Builder`, `Above & Beyond`, `Mentor of the Month`) with distinct emoji + point weights.
- **Public**: every recognition becomes a card on the Recognition page and contributes to the leaderboard.
- **Searchable**: the GiveRecognitionModal lets you type a colleague’s name, role or email.
- **Trended**: posts vs recognitions comparison surfaces healthy two-way activity.

## 10. Moderation

- **Author flags + auto flags** both feed the `moderationQueue` (e.g. keyword `leak` auto-flags).
- HR/Admin sees a unified queue with status filters (pending / flagged / approved / rejected).
- **Visibility & flagging** together create the “avoid clutter and unwanted communication” outcome the brief calls out.

## 11. Roles & guards

| Role     | Sample seed user   | Sees admin section | Can publish announcements / leadership / milestones | Approves moderation |
|----------|--------------------|---------------------|------------------------------------------------------|----------------------|
| employee | Rahul Sharma (e4)  | No                  | No                                                   | No                   |
| hr       | Priya Verma (e2)   | Yes                 | Yes                                                  | Yes                  |
| admin    | Vivek Iyer (e0)    | Yes                 | Yes                                                  | Yes                  |

`ProtectedRoute` guards every page. `roles=[]` lets you add finer-grained gates later.

## 12. Web vs APK feature parity

| Surface              | Web (full)        | APK (limited) |
|----------------------|-------------------|---------------|
| Dashboard            | ✅                | ✅            |
| Feed (compose+react) | ✅                | ✅            |
| Recognition          | ✅                | ✅            |
| Directory            | ✅                | ✅            |
| Events               | ✅                | ✅            |
| Forum                | ✅                | (web)         |
| Knowledge Hub        | ✅                | (web)         |
| Gallery              | ✅                | (web)         |
| Admin / HR console   | ✅                | (web)         |

The mobile bottom nav surfaces the five engagement-critical surfaces. The other surfaces remain reachable via the side drawer for power users.

## 13. Security & privacy posture (for the future backend)

- All write actions are role-aware on the client; the same checks must be enforced server-side.
- Visibility is enforced **at the data layer**, not in the UI alone.
- Auth is a placeholder (localStorage); production should use SSO with short-lived tokens.
- Audit fields (`created_by`, `updated_by`, `tenant_id`) should be added on every entity.

## 14. Demo accounts

| Email                | Password    | Role     | Linked employee   |
|----------------------|-------------|----------|-------------------|
| employee@corp.com    | employee123 | employee | Rahul Sharma (e4) |
| hr@corp.com          | hr123       | hr       | Priya Verma (e2)  |
| admin@corp.com       | admin123    | admin    | Vivek Iyer (e0)   |

## 15. Run & build

```
npm install
npm run dev      # local web dev
npm run build    # production bundle into /dist
npm run lint     # eslint
# Mobile (already scaffolded via Capacitor)
npx cap sync android
npx cap open android
```
