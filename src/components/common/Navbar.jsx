import { Menu, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import Tag from "./Tag";

function UserMenu() {
  const me = useStore((s) => s.getCurrentUser());
  const role = useStore((s) => s.role);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition"
      >
        <Avatar name={me?.name} size="sm" ring />
        <div className="hidden md:block text-left leading-tight">
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">
            {me?.name}
          </p>
          <p className="text-[11px] muted capitalize">{role || "guest"}</p>
        </div>
        <ChevronDown size={14} className="muted hidden md:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 card overflow-hidden z-50 animate-pop-in">
          <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3">
            <Avatar name={me?.name} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{me?.name}</p>
              <p className="text-xs muted truncate">{me?.email}</p>
              <Tag tone="brand" className="mt-1.5 capitalize">
                {role || "guest"}
              </Tag>
            </div>
          </div>
          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-sm"
            >
              <UserCircle size={16} /> My profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-500/15 text-danger-600 text-sm"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ onOpenMobileNav }) {
  const me = useStore((s) => s.getCurrentUser());
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-ink-900/80 backdrop-blur border-b border-ink-100 dark:border-ink-800">
      <div className="px-4 lg:px-6 py-3 flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl border border-ink-200 dark:border-ink-700"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="hidden md:block">
          <h1 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">
            Hi {me?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-xs muted">
            Here is what is happening across the company today.
          </p>
        </div>

        <div className="flex-1 max-w-xl mx-auto">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
