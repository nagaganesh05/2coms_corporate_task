import { Moon, Bell, User, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";
import { cn } from "../lib/utils";

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        on ? "bg-brand-600" : "bg-ink-200 dark:bg-ink-700",
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
          on && "translate-x-5",
        )}
      />
    </button>
  );
}

function Row({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900 dark:text-ink-100">{title}</p>
        <p className="text-sm muted">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Settings() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const me = useStore((s) => s.getCurrentUser());

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-100">
          Settings
        </h1>
        <p className="muted text-sm">Personalize CorpConnect for the way you work.</p>
      </div>

      <div className="card p-2 sm:p-5 divide-y divide-ink-100 dark:divide-ink-800">
        <Row
          icon={Moon}
          title="Dark mode"
          description="Switch to a darker theme — easier on the eyes."
        >
          <Toggle on={theme === "dark"} onChange={toggleTheme} />
        </Row>
        <Row
          icon={Bell}
          title="Email digests"
          description="Get a weekly summary of leadership messages and recognitions."
        >
          <Toggle on={true} onChange={() => {}} />
        </Row>
        <Row
          icon={Bell}
          title="Mobile push"
          description="Notifications on your CorpConnect mobile app."
        >
          <Toggle on={true} onChange={() => {}} />
        </Row>
      </div>

      <div className="card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
        <Link
          to="/profile"
          className="flex items-center gap-4 p-4 hover:bg-ink-50 dark:hover:bg-ink-800/60"
        >
          <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{me?.name}</p>
            <p className="text-sm muted">View and edit your public profile</p>
          </div>
          <ChevronRight size={16} className="text-ink-400" />
        </Link>
        <Link
          to="/notifications"
          className="flex items-center gap-4 p-4 hover:bg-ink-50 dark:hover:bg-ink-800/60"
        >
          <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <Bell size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Notification preferences</p>
            <p className="text-sm muted">Choose which alerts you receive</p>
          </div>
          <ChevronRight size={16} className="text-ink-400" />
        </Link>
        <div className="flex items-center gap-4 p-4">
          <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <Shield size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Privacy &amp; visibility</p>
            <p className="text-sm muted">
              Your manager and HR always have access for compliance reasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
