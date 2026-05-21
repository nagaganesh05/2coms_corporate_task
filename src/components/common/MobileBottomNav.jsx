import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Users,
  Calendar,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Mobile (Capacitor APK) shows only the most engagement-critical surfaces.
// This is the "limited features" set referenced in the brief.
const items = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/feed", label: "Feed", icon: Newspaper },
  { to: "/recognition", label: "Praise", icon: Trophy },
  { to: "/directory", label: "People", icon: Users },
  { to: "/events", label: "Events", icon: Calendar },
];

function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-ink-900/95 backdrop-blur border-t border-ink-100 dark:border-ink-800 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium",
                  isActive
                    ? "text-brand-600 dark:text-brand-300"
                    : "text-ink-500 dark:text-ink-400",
                )
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileBottomNav;
