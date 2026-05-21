# CorpConnect

A modern, opinionated **internal engagement & communication platform** for a whole organization — leadership messages, recognition, departmental footprints, knowledge hub, forum, gallery and admin/HR controls. Built as a web app and a Capacitor-ready Android shell so the mobile APK exposes the engagement-critical subset.

> **Why this exists.** Most intranets are a noticeboard. CorpConnect is structured to *break silos* (cross-functional discovery, multi-tenant visibility), *strengthen recognition culture* (peer praise, badges, leaderboard), and *prioritize information* (dashboard with a clear hierarchy). Simple yet powerful.

## Quick start

```bash
npm install
npm run dev       # web app on http://localhost:5173
npm run build     # production bundle
npm run lint
```

### Demo logins

| Email               | Password    | Role     |
|---------------------|-------------|----------|
| `employee@corp.com` | `employee123` | employee |
| `hr@corp.com`       | `hr123`     | hr       |
| `admin@corp.com`    | `admin123`  | admin    |

The login page also has one-click demo buttons.

## Mobile (APK)

```bash
npm run build
npx cap sync android
npx cap open android
```

The mobile experience surfaces the five engagement-critical destinations through a bottom nav (Home / Feed / Praise / People / Events). Other surfaces remain reachable via the side drawer.

## Feature map

- **Dashboard** with a deliberate priority gradient: Leadership vision → KPIs → Engagement chart + leadership messages → Monthly leadership meet outcomes → Recognition spotlight + poll → New joinees carousel → Department footprints → Engagement calendar + leaderboard + birthdays → Milestones timeline + quick actions.
- **Feed** with a typed composer (experience / celebration / project win / announcement), department vs everyone visibility, reactions (like / celebrate / support), inline comments, pinning, filters.
- **Recognition** with peer-to-peer kudos, 5 badge archetypes with point weights, gamified leaderboard, and a recognition trend chart.
- **Forum** with two-way threads, replies, likes, and report-to-moderation flow.
- **Directory** with vertical/department/location/skill filters and a profile preview modal.
- **Teams** by vertical, with leads and member avatars.
- **Events** with a month grid + heatmap engagement calendar and RSVP.
- **Knowledge Hub** categorized by Handbook / Policy / Runbook / Brand / Playbook + searchable.
- **Gallery** with photos and videos tabs and a lightbox.
- **Admin/HR**: command-center dashboard, content publishing (announcement priority, leadership message, milestone), moderation queue, analytics.
- **Multi-tenancy / visibility controls**: every post carries a visibility scope; selectors enforce this everywhere.
- **Theming**: brand indigo + warm orange accent + dark mode.

## Architecture

For the full data model, schema and design rationale see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Tech

Vite · React 19 · Tailwind CSS · Zustand · React Router v7 · Recharts · Swiper · Framer Motion · Capacitor (Android).
