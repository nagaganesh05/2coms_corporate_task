import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Users,
  Calendar,
  BookOpen,
  Shield,
  Bell,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <div className="w-72 bg-white border-r min-h-screen p-5">
      <h1 className="text-3xl font-bold text-primary mb-10">CorpConnect</h1>

      <div className="space-y-2">
        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/"
        >
          <LayoutDashboard /> Dashboard
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/feed"
        >
          <Newspaper /> Feed
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/recognition"
        >
          <Trophy /> Recognition
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/directory"
        >
          <Users /> Directory
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/events"
        >
          <Calendar /> Events
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/knowledge"
        >
          <BookOpen /> Knowledge Hub
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/notifications"
        >
          <Bell /> Notifications
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/admin"
        >
          <Shield /> Admin
        </Link>

        <Link
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
          to="/settings"
        >
          <Settings /> Settings
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
