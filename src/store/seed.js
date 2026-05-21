// ---------------------------------------------------------------------------
// Seed data for the Corporate Intranet.
// In a real deployment these collections come from a backend (see ARCHITECTURE.md
// for the schema). The shape is intentionally close to a relational/document DB
// so the front-end can be ported with minimal changes.
// ---------------------------------------------------------------------------

const today = new Date();
const daysAgo = (n) => new Date(today.getTime() - n * 86_400_000).toISOString();
const daysFromNow = (n) =>
  new Date(today.getTime() + n * 86_400_000).toISOString();

// ---------- Verticals & Departments ----------
export const verticals = [
  { id: "tech", name: "Technology", color: "from-indigo-500 to-violet-500" },
  { id: "biz", name: "Business", color: "from-blue-500 to-cyan-500" },
  { id: "ops", name: "Operations", color: "from-emerald-500 to-teal-500" },
  { id: "ppl", name: "People & Culture", color: "from-rose-500 to-pink-500" },
];

export const departments = [
  { id: "engineering", name: "Engineering", verticalId: "tech", lead: "e1" },
  { id: "design", name: "Design", verticalId: "tech", lead: "e3" },
  { id: "data", name: "Data & AI", verticalId: "tech", lead: "e7" },
  { id: "sales", name: "Sales", verticalId: "biz", lead: "e5" },
  { id: "marketing", name: "Marketing", verticalId: "biz", lead: "e8" },
  { id: "finance", name: "Finance", verticalId: "ops", lead: "e9" },
  { id: "legal", name: "Legal", verticalId: "ops", lead: "e10" },
  { id: "hr", name: "Human Resources", verticalId: "ppl", lead: "e2" },
  { id: "leadership", name: "Leadership", verticalId: "ppl", lead: "e0" },
];

// ---------- Employees ----------
export const employees = [
  {
    id: "e0",
    name: "Vivek Iyer",
    role: "Chief Executive Officer",
    departmentId: "leadership",
    location: "Hyderabad",
    skills: ["Strategy", "Leadership"],
    joinDate: "2014-03-12",
    dob: "1976-08-04",
    email: "vivek.iyer@corp.com",
    manager: null,
    bio: "Building a culture that compounds. Long-term curious.",
  },
  {
    id: "e1",
    name: "Aarav Mehta",
    role: "VP, Engineering",
    departmentId: "engineering",
    location: "Bengaluru",
    skills: ["Architecture", "Scale", "Mentoring"],
    joinDate: "2017-06-01",
    dob: "1985-11-19",
    email: "aarav.mehta@corp.com",
    manager: "e0",
    bio: "Engineering excellence is a team sport.",
  },
  {
    id: "e2",
    name: "Priya Verma",
    role: "Head of HR",
    departmentId: "hr",
    location: "Hyderabad",
    skills: ["People Ops", "Culture"],
    joinDate: "2016-04-20",
    dob: "1984-02-22",
    email: "priya.verma@corp.com",
    manager: "e0",
    bio: "People first, always.",
  },
  {
    id: "e3",
    name: "Ananya Rao",
    role: "Lead Product Designer",
    departmentId: "design",
    location: "Bengaluru",
    skills: ["Design Systems", "Research"],
    joinDate: "2019-01-15",
    dob: "1992-05-10",
    email: "ananya.rao@corp.com",
    manager: "e1",
    bio: "Designing simple, powerful experiences.",
  },
  {
    id: "e4",
    name: "Rahul Sharma",
    role: "Senior Frontend Engineer",
    departmentId: "engineering",
    location: "Pune",
    skills: ["React", "TypeScript", "Performance"],
    joinDate: "2021-07-12",
    dob: "1994-09-30",
    email: "rahul.sharma@corp.com",
    manager: "e1",
    bio: "Crafting reliable, fast UIs.",
  },
  {
    id: "e5",
    name: "Kiran Kapoor",
    role: "VP, Sales",
    departmentId: "sales",
    location: "Mumbai",
    skills: ["Enterprise Sales", "GTM"],
    joinDate: "2018-09-05",
    dob: "1981-12-12",
    email: "kiran.kapoor@corp.com",
    manager: "e0",
    bio: "Customer outcomes drive revenue.",
  },
  {
    id: "e6",
    name: "Neha Singh",
    role: "Backend Engineer",
    departmentId: "engineering",
    location: "Bengaluru",
    skills: ["Go", "Kafka", "Postgres"],
    joinDate: "2022-03-01",
    dob: "1996-04-18",
    email: "neha.singh@corp.com",
    manager: "e1",
    bio: "Distributed systems geek.",
  },
  {
    id: "e7",
    name: "Arjun Menon",
    role: "Director, Data & AI",
    departmentId: "data",
    location: "Bengaluru",
    skills: ["ML", "Data Platform"],
    joinDate: "2020-11-09",
    dob: "1987-07-07",
    email: "arjun.menon@corp.com",
    manager: "e1",
    bio: "From data to decisions.",
  },
  {
    id: "e8",
    name: "Riya Kapoor",
    role: "Marketing Manager",
    departmentId: "marketing",
    location: "Mumbai",
    skills: ["Brand", "Content", "Events"],
    joinDate: "2021-02-20",
    dob: "1993-10-02",
    email: "riya.kapoor@corp.com",
    manager: "e5",
    bio: "Stories that compound.",
  },
  {
    id: "e9",
    name: "Suresh Patel",
    role: "Finance Controller",
    departmentId: "finance",
    location: "Hyderabad",
    skills: ["FP&A", "Compliance"],
    joinDate: "2015-08-11",
    dob: "1980-03-14",
    email: "suresh.patel@corp.com",
    manager: "e0",
    bio: "Numbers tell the truth.",
  },
  {
    id: "e10",
    name: "Maya Iyer",
    role: "Legal Counsel",
    departmentId: "legal",
    location: "Hyderabad",
    skills: ["Contracts", "Compliance"],
    joinDate: "2019-12-01",
    dob: "1988-06-25",
    email: "maya.iyer@corp.com",
    manager: "e0",
    bio: "Calm, clear, and careful.",
  },
  {
    id: "e11",
    name: "Karthik Reddy",
    role: "DevOps Engineer",
    departmentId: "engineering",
    location: "Hyderabad",
    skills: ["Kubernetes", "AWS"],
    joinDate: "2023-05-15",
    dob: "1995-01-23",
    email: "karthik.reddy@corp.com",
    manager: "e1",
    bio: "Reliability is a feature.",
  },
  {
    id: "e12",
    name: "Sara Joseph",
    role: "Product Manager",
    departmentId: "design",
    location: "Bengaluru",
    skills: ["Discovery", "Roadmaps"],
    joinDate: "2024-01-10",
    dob: "1991-11-11",
    email: "sara.joseph@corp.com",
    manager: "e3",
    bio: "Outcomes over output.",
  },
  // ---- New joinees (last 30 days) ----
  {
    id: "e13",
    name: "Ishaan Gupta",
    role: "Frontend Engineer",
    departmentId: "engineering",
    location: "Bengaluru",
    skills: ["React", "Tailwind"],
    joinDate: daysAgo(6).slice(0, 10),
    dob: "1998-09-04",
    email: "ishaan.gupta@corp.com",
    manager: "e1",
    bio: "Making the web feel handcrafted.",
  },
  {
    id: "e14",
    name: "Meera Nair",
    role: "UX Researcher",
    departmentId: "design",
    location: "Bengaluru",
    skills: ["Research", "Synthesis"],
    joinDate: daysAgo(12).slice(0, 10),
    dob: "1995-06-21",
    email: "meera.nair@corp.com",
    manager: "e3",
    bio: "Listening as a craft.",
  },
  {
    id: "e15",
    name: "Devansh Roy",
    role: "Account Executive",
    departmentId: "sales",
    location: "Mumbai",
    skills: ["Pipeline", "Closing"],
    joinDate: daysAgo(20).slice(0, 10),
    dob: "1994-12-30",
    email: "devansh.roy@corp.com",
    manager: "e5",
    bio: "Trust is the strategy.",
  },
];

// ---------- Leadership messages ----------
export const leadershipMessages = [
  {
    id: "lm1",
    authorId: "e0",
    title: "Vision 2026: Building a culture that compounds",
    body: "This year we focus on three bets — AI-native products, customer obsession, and a stronger one-team culture across verticals. Thank you for showing up for each other.",
    createdAt: daysAgo(2),
    pinned: true,
  },
  {
    id: "lm2",
    authorId: "e1",
    title: "Engineering Quality Bar",
    body: "Quality is a habit. We are introducing weekly review rituals and a public reliability dashboard to keep us honest.",
    createdAt: daysAgo(9),
  },
  {
    id: "lm3",
    authorId: "e2",
    title: "From the People & Culture team",
    body: "We added two new wellness benefits and refreshed the parental leave policy. Watch the Knowledge Hub for the full update.",
    createdAt: daysAgo(14),
  },
];

// ---------- Monthly leadership meet outcomes ----------
export const leadershipMeets = [
  {
    id: "mm1",
    month: "May 2026",
    headline: "All-time high customer NPS",
    outcomes: [
      "Cross-functional AI Council formed",
      "Quarterly OKRs published company-wide",
      "Two new offices announced — Pune & Singapore",
    ],
    nextSteps: ["Hiring plan refresh", "Hackathon in June"],
    createdAt: daysAgo(3),
  },
  {
    id: "mm2",
    month: "April 2026",
    headline: "Operational excellence quarter",
    outcomes: [
      "Reduced incident MTTR by 38%",
      "Launched Customer Success function",
      "Org-wide DEI charter ratified",
    ],
    nextSteps: ["Revisit on-call rotation", "DEI champions program"],
    createdAt: daysAgo(33),
  },
];

// ---------- Milestones ----------
export const milestones = [
  {
    id: "ms1",
    title: "2,500 employees worldwide",
    body: "We crossed the 2,500 mark this quarter — across 9 cities and 6 countries.",
    date: daysAgo(7),
    departmentId: "leadership",
  },
  {
    id: "ms2",
    title: "AI Platform GA",
    body: "Engineering shipped the AI Platform to general availability after 6 months of incubation.",
    date: daysAgo(15),
    departmentId: "engineering",
  },
  {
    id: "ms3",
    title: "$50M ARR milestone",
    body: "Sales closed three flagship enterprise accounts pushing us past $50M ARR.",
    date: daysAgo(22),
    departmentId: "sales",
  },
  {
    id: "ms4",
    title: "Top 25 Best Places to Work",
    body: "People & Culture team helped us land in the Top 25 Best Places to Work list.",
    date: daysAgo(40),
    departmentId: "hr",
  },
];

// ---------- Department footprints (impact tiles) ----------
export const footprints = [
  {
    departmentId: "engineering",
    impact: "12 releases this month",
    metric: 12,
    delta: "+3 vs last month",
    blurb: "Including the AI Platform GA and 4 reliability wins.",
  },
  {
    departmentId: "design",
    impact: "Design system v2 rolled out",
    metric: 38,
    delta: "+38 components shipped",
    blurb: "Adopted across 6 product surfaces.",
  },
  {
    departmentId: "data",
    impact: "3 ML models in production",
    metric: 3,
    delta: "+1 since April",
    blurb: "Recommendation, churn, and forecast.",
  },
  {
    departmentId: "sales",
    impact: "$50M ARR crossed",
    metric: 50,
    delta: "+11% QoQ",
    blurb: "Enterprise tier outpacing forecast.",
  },
  {
    departmentId: "marketing",
    impact: "2 industry awards",
    metric: 2,
    delta: "Brand momentum",
    blurb: "Best B2B Campaign and Best Brand Refresh.",
  },
  {
    departmentId: "hr",
    impact: "94% offer acceptance",
    metric: 94,
    delta: "+6 pts",
    blurb: "Strongest hiring quarter on record.",
  },
];

// ---------- Posts (Feed) ----------
// visibility: ["all"] OR list of department ids who can see it.
export const posts = [
  {
    id: "p1",
    type: "leadership",
    authorId: "e0",
    title: "Why we are doubling down on customer obsession",
    body:
      "Our customers are the reason we exist. Over the next two quarters we will go deeper on understanding their workflows. Expect more customer days, listening sessions and shadow programs.",
    visibility: ["all"],
    createdAt: daysAgo(1),
    pinned: true,
    reactions: { like: 124, celebrate: 38, support: 12 },
    likedByMe: false,
    comments: [
      {
        id: "c1",
        authorId: "e3",
        body: "Looking forward to participating in customer days!",
        createdAt: daysAgo(1),
      },
      {
        id: "c2",
        authorId: "e8",
        body: "Marketing can help with the customer story library.",
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: "p2",
    type: "project_win",
    authorId: "e1",
    title: "AI Platform reaches General Availability",
    body:
      "Six months, four squads, one massive milestone. Huge thanks to the data, platform and design teams for making this real.",
    visibility: ["all"],
    createdAt: daysAgo(2),
    reactions: { like: 210, celebrate: 96, support: 8 },
    likedByMe: true,
    contributors: ["e1", "e6", "e7", "e3", "e11"],
    comments: [
      {
        id: "c3",
        authorId: "e7",
        body: "Proud of this team. On to the next.",
        createdAt: daysAgo(2),
      },
    ],
  },
  {
    id: "p3",
    type: "celebration",
    authorId: "e2",
    title: "Welcome to our newest joinees!",
    body:
      "Meet Ishaan, Meera and Devansh. Help them feel at home — drop a hello in the replies.",
    visibility: ["all"],
    createdAt: daysAgo(3),
    reactions: { like: 78, celebrate: 64, support: 4 },
    comments: [],
  },
  {
    id: "p4",
    type: "footprint",
    authorId: "e7",
    title: "Data & AI: model platform now powers 3 production use-cases",
    body:
      "Recommendation, churn prediction and forecasting are all live. Internal docs in the Knowledge Hub.",
    visibility: ["engineering", "data", "leadership"],
    createdAt: daysAgo(4),
    reactions: { like: 41, celebrate: 11, support: 2 },
    comments: [],
  },
  {
    id: "p5",
    type: "announcement",
    authorId: "e2",
    title: "New parental leave policy",
    body:
      "Effective from next month — improved leave duration and flexible return-to-work options. Full policy in the Knowledge Hub.",
    visibility: ["all"],
    createdAt: daysAgo(5),
    priority: "high",
    reactions: { like: 188, celebrate: 22, support: 64 },
    comments: [],
  },
  {
    id: "p6",
    type: "project_win",
    authorId: "e5",
    title: "Three flagship enterprise wins this quarter",
    body:
      "We closed three Tier-1 enterprise customers this quarter — congratulations to the field and customer success teams.",
    visibility: ["sales", "marketing", "leadership"],
    createdAt: daysAgo(6),
    reactions: { like: 56, celebrate: 31, support: 0 },
    contributors: ["e5", "e15", "e8"],
    comments: [],
  },
  {
    id: "p7",
    type: "experience",
    authorId: "e4",
    title: "What I learned in my first hackathon as a hire",
    body:
      "From idea to demo in 36 hours. Sharing the messy middle, not just the shiny outcome.",
    visibility: ["all"],
    createdAt: daysAgo(8),
    reactions: { like: 87, celebrate: 19, support: 12 },
    comments: [],
  },
];

// ---------- Recognitions ----------
export const badges = [
  { id: "b1", name: "Innovation Star", emoji: "💡", points: 50 },
  { id: "b2", name: "Customer Champion", emoji: "🤝", points: 40 },
  { id: "b3", name: "Culture Builder", emoji: "🌱", points: 30 },
  { id: "b4", name: "Above & Beyond", emoji: "🚀", points: 60 },
  { id: "b5", name: "Mentor of the Month", emoji: "🧭", points: 35 },
];

export const recognitions = [
  {
    id: "r1",
    fromId: "e1",
    toId: "e3",
    badgeId: "b1",
    message: "The new design system shipped on time and is already saving teams weeks of work.",
    createdAt: daysAgo(1),
  },
  {
    id: "r2",
    fromId: "e0",
    toId: "e6",
    badgeId: "b4",
    message: "Stayed up two nights to ensure a clean launch — that is leadership.",
    createdAt: daysAgo(2),
  },
  {
    id: "r3",
    fromId: "e3",
    toId: "e12",
    badgeId: "b3",
    message: "Brought such warmth and clarity to the design ritual revamp.",
    createdAt: daysAgo(3),
  },
  {
    id: "r4",
    fromId: "e5",
    toId: "e8",
    badgeId: "b2",
    message: "The customer story program is a quiet revolution.",
    createdAt: daysAgo(5),
  },
  {
    id: "r5",
    fromId: "e1",
    toId: "e11",
    badgeId: "b5",
    message: "Mentored two interns into engineers we now want to keep.",
    createdAt: daysAgo(7),
  },
  {
    id: "r6",
    fromId: "e7",
    toId: "e6",
    badgeId: "b1",
    message: "Shipped the streaming pipeline that unblocked the AI platform.",
    createdAt: daysAgo(9),
  },
];

// ---------- Events ----------
export const events = [
  {
    id: "ev1",
    title: "Monthly Leadership Town Hall",
    type: "townhall",
    date: daysFromNow(3),
    location: "Auditorium + Zoom",
    description: "Open Q&A with the leadership team.",
    rsvp: 412,
    departmentId: "leadership",
  },
  {
    id: "ev2",
    title: "Innovate-A-Thon 2026",
    type: "hackathon",
    date: daysFromNow(12),
    location: "Bengaluru Campus",
    description: "48-hour cross-functional hackathon.",
    rsvp: 287,
    departmentId: "engineering",
  },
  {
    id: "ev3",
    title: "Wellness Week",
    type: "wellness",
    date: daysFromNow(20),
    location: "All offices + Virtual",
    description: "Yoga, talks, mindfulness and a step challenge.",
    rsvp: 540,
    departmentId: "hr",
  },
  {
    id: "ev4",
    title: "Customer Stories Night",
    type: "celebration",
    date: daysFromNow(27),
    location: "Mumbai HQ",
    description: "Hear from three flagship customers.",
    rsvp: 132,
    departmentId: "sales",
  },
  {
    id: "ev5",
    title: "Design System v2 Launch",
    type: "launch",
    date: daysFromNow(8),
    location: "Online",
    description: "Walkthrough of the new design system.",
    rsvp: 96,
    departmentId: "design",
  },
  {
    id: "ev6",
    title: "Q3 Sales Kickoff",
    type: "kickoff",
    date: daysFromNow(35),
    location: "Goa offsite",
    description: "Annual GTM alignment.",
    rsvp: 78,
    departmentId: "sales",
  },
];

// ---------- Polls ----------
export const polls = [
  {
    id: "pl1",
    question: "Which initiative should we prioritize next quarter?",
    options: [
      { id: "o1", text: "AI-native product capabilities", votes: 312 },
      { id: "o2", text: "Employee wellness expansion", votes: 218 },
      { id: "o3", text: "Hybrid work policy refresh", votes: 184 },
      { id: "o4", text: "Customer success program", votes: 142 },
    ],
    voted: null,
    closesAt: daysFromNow(7),
  },
];

// ---------- Knowledge docs ----------
export const knowledgeDocs = [
  {
    id: "k1",
    title: "Employee Handbook 2026",
    category: "Handbook",
    type: "PDF",
    ownerId: "e2",
    updatedAt: daysAgo(10),
    size: "3.2 MB",
  },
  {
    id: "k2",
    title: "Code of Conduct",
    category: "Policy",
    type: "PDF",
    ownerId: "e10",
    updatedAt: daysAgo(60),
    size: "0.6 MB",
  },
  {
    id: "k3",
    title: "Parental Leave Policy",
    category: "Policy",
    type: "PDF",
    ownerId: "e2",
    updatedAt: daysAgo(5),
    size: "0.4 MB",
  },
  {
    id: "k4",
    title: "Information Security Guidelines",
    category: "Policy",
    type: "PDF",
    ownerId: "e10",
    updatedAt: daysAgo(45),
    size: "1.1 MB",
  },
  {
    id: "k5",
    title: "Engineering On-Call Runbook",
    category: "Runbook",
    type: "Doc",
    ownerId: "e1",
    updatedAt: daysAgo(20),
    size: "—",
  },
  {
    id: "k6",
    title: "Brand Guidelines v3",
    category: "Brand",
    type: "Doc",
    ownerId: "e8",
    updatedAt: daysAgo(33),
    size: "—",
  },
  {
    id: "k7",
    title: "Sales Playbook 2026",
    category: "Playbook",
    type: "Doc",
    ownerId: "e5",
    updatedAt: daysAgo(8),
    size: "—",
  },
  {
    id: "k8",
    title: "Onboarding First Week Guide",
    category: "Handbook",
    type: "Video",
    ownerId: "e2",
    updatedAt: daysAgo(15),
    size: "12 min",
  },
];

// ---------- Gallery ----------
export const galleryPhotos = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900",
    title: "Annual Town Hall",
    event: "Town Hall 2026",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900",
    title: "Hackathon Demo Day",
    event: "Innovate-A-Thon",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    title: "Engineering Offsite",
    event: "Eng Offsite",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=900",
    title: "Wellness Week Yoga",
    event: "Wellness Week",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900",
    title: "Leadership Summit",
    event: "Leadership Summit",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
    title: "Onboarding Day",
    event: "New Joinee Welcome",
  },
  {
    id: "g7",
    url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900",
    title: "Design Critique",
    event: "Design Week",
  },
  {
    id: "g8",
    url: "https://images.unsplash.com/photo-1543269664-647b9ba0ed28?w=900",
    title: "Diwali Celebration",
    event: "Festive Week",
  },
];

export const galleryVideos = [
  {
    id: "v1",
    thumb: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900",
    title: "CEO Vision 2026",
    duration: "4:12",
  },
  {
    id: "v2",
    thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900",
    title: "Hackathon Highlights",
    duration: "2:38",
  },
  {
    id: "v3",
    thumb: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900",
    title: "Customer Stories Reel",
    duration: "3:50",
  },
];

// ---------- Forum threads ----------
export const forumThreads = [
  {
    id: "t1",
    title: "How do we make hybrid work great for everyone?",
    body: "Looking for honest takes — what is working, what is not?",
    authorId: "e2",
    departmentId: "hr",
    createdAt: daysAgo(2),
    likes: 124,
    flagged: false,
    tags: ["culture", "hybrid"],
    replies: [
      {
        id: "tr1",
        authorId: "e4",
        body: "Async-first norms are saving me hours a week.",
        createdAt: daysAgo(2),
      },
      {
        id: "tr2",
        authorId: "e8",
        body: "Predictable in-office days for marketing brainstorms.",
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: "t2",
    title: "AI tools you actually use day-to-day",
    body: "Share what is making you more productive — beyond the hype.",
    authorId: "e7",
    departmentId: "data",
    createdAt: daysAgo(4),
    likes: 89,
    flagged: false,
    tags: ["ai", "productivity"],
    replies: [
      {
        id: "tr3",
        authorId: "e6",
        body: "Code review assistants for Go services.",
        createdAt: daysAgo(3),
      },
    ],
  },
  {
    id: "t3",
    title: "Best running route around the Bengaluru campus",
    body: "Weekend morning run buddies?",
    authorId: "e11",
    departmentId: "engineering",
    createdAt: daysAgo(6),
    likes: 32,
    flagged: false,
    tags: ["wellness", "fun"],
    replies: [],
  },
];

// ---------- Notifications ----------
export const notifications = [
  {
    id: "n1",
    type: "recognition",
    message: "Aarav recognized you as a Mentor of the Month.",
    createdAt: daysAgo(0.1),
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    message: "Ananya commented on your post.",
    createdAt: daysAgo(0.3),
    read: false,
  },
  {
    id: "n3",
    type: "event",
    message: "Town Hall scheduled in 3 days.",
    createdAt: daysAgo(1),
    read: false,
  },
  {
    id: "n4",
    type: "policy",
    message: "Parental leave policy updated.",
    createdAt: daysAgo(2),
    read: true,
  },
];

// ---------- Moderation queue (admin/HR only) ----------
export const moderationQueue = [
  {
    id: "mq1",
    type: "post",
    authorId: "e8",
    title: "Marketing internal poster draft",
    body: "Draft visual for the brand refresh — needs leadership approval.",
    createdAt: daysAgo(1),
    status: "pending",
  },
  {
    id: "mq2",
    type: "forum",
    authorId: "e15",
    title: "Question about expense policy",
    body: "Is the per diem reimbursable for offsite travel?",
    createdAt: daysAgo(1),
    status: "pending",
  },
  {
    id: "mq3",
    type: "comment",
    authorId: "e6",
    title: "Reply on AI tools thread",
    body: "We should be careful about leaking source code.",
    createdAt: daysAgo(2),
    status: "flagged",
    reason: "Auto-flagged: keyword 'leak'",
  },
];

// ---------- Engagement timeseries (analytics) ----------
export const engagementMonthly = [
  { month: "Dec", engagement: 62, posts: 184, recognitions: 92 },
  { month: "Jan", engagement: 68, posts: 211, recognitions: 121 },
  { month: "Feb", engagement: 72, posts: 234, recognitions: 138 },
  { month: "Mar", engagement: 78, posts: 268, recognitions: 156 },
  { month: "Apr", engagement: 84, posts: 301, recognitions: 178 },
  { month: "May", engagement: 91, posts: 332, recognitions: 214 },
];

export const departmentDistribution = [
  { name: "Engineering", value: 740 },
  { name: "Sales", value: 320 },
  { name: "Marketing", value: 180 },
  { name: "Design", value: 140 },
  { name: "HR", value: 95 },
  { name: "Finance", value: 80 },
  { name: "Data & AI", value: 110 },
  { name: "Legal", value: 35 },
];

// ---------- Engagement calendar (heatmap) ----------
export function buildEngagementHeatmap(daysBack = 84) {
  const out = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86_400_000);
    // pseudo-random but stable per day
    const seed = d.getDate() * 13 + d.getMonth() * 7;
    const intensity = (seed % 5) + ((i % 11 === 0) ? 4 : 0);
    out.push({
      date: d.toISOString().slice(0, 10),
      value: Math.min(intensity, 5),
    });
  }
  return out;
}
