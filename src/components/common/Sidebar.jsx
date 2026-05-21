import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Users,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  MessagesSquare,
  Bell,
  Shield,
  Settings,
  Building2,
  BarChart3,
  Megaphone,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import useStore from "../../store/useStore";
import { cn } from "../../lib/utils";

const NAV = {
  workspace: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/feed", label: "Feed", icon: Newspaper },
    { to: "/recognition", label: "Recognition", icon: Trophy },
    { to: "/forum", label: "Forum", icon: MessagesSquare },
  ],
  organization: [
    { to: "/directory", label: "Directory", icon: Users },
    { to: "/teams", label: "Teams", icon: Building2 },
    { to: "/events", label: "Events", icon: Calendar },
  ],
  knowledge: [
    { to: "/knowledge", label: "Knowledge Hub", icon: BookOpen },
    { to: "/gallery", label: "Gallery", icon: ImageIcon },
  ],
  account: [
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { to: "/admin", label: "Admin Console", icon: Shield, end: true },
    { to: "/admin/content", label: "Content", icon: Megaphone },
    { to: "/admin/moderation", label: "Moderation", icon: Sparkles },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
};

function Group({ title, items, collapsed, onItemClick }) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {title}
        </p>
      )}
      <div className="space-y-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                  : "text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, onMobileClose }) {
  const role = useStore((s) => s.role);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // hide sidebar on /login
  if (location.pathname === "/login") return null;

  const showAdmin = role === "admin" || role === "hr";

  const inner = (
    <div
      className={cn(
        "h-full flex flex-col bg-white dark:bg-ink-900 border-r border-ink-100 dark:border-ink-800 transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-ink-100 dark:border-ink-800">
        <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold">
          C
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display font-extrabold text-ink-900 dark:text-white text-lg">
              CorpConnect
            </p>
            <p className="text-[11px] text-ink-500">Internal engagement</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <Group
          title="Workspace"
          items={NAV.workspace}
          collapsed={collapsed}
          onItemClick={onMobileClose}
        />
        <Group
          title="Organization"
          items={NAV.organization}
          collapsed={collapsed}
          onItemClick={onMobileClose}
        />
        <Group
          title="Knowledge"
          items={NAV.knowledge}
          collapsed={collapsed}
          onItemClick={onMobileClose}
        />
        <Group
          title="Account"
          items={NAV.account}
          collapsed={collapsed}
          onItemClick={onMobileClose}
        />
        {showAdmin && (
          <Group
            title="Admin & HR"
            items={NAV.admin}
            collapsed={collapsed}
            onItemClick={onMobileClose}
          />
        )}
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center gap-2 m-3 mt-0 px-3 py-2 rounded-xl border border-ink-200 dark:border-ink-700 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
      >
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block sticky top-0 h-screen z-30">
        {inner}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
      >
        <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[260px] transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {inner}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
