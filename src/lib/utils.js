// Misc helpers used across the app.

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const palette = [
  "from-indigo-500 to-violet-500",
  "from-blue-500 to-cyan-500",
  "from-fuchsia-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-sky-500 to-blue-500",
  "from-purple-500 to-indigo-500",
];

export function avatarGradient(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function timeAgo(dateLike) {
  const d = new Date(dateLike);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(diff)) return "";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDate(dateLike, opts = { day: "numeric", month: "short" }) {
  return new Date(dateLike).toLocaleDateString(undefined, opts);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
