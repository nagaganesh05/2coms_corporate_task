import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Sparkles, Users, Trophy } from "lucide-react";
import useStore from "../store/useStore";

// Seed credentials. Each maps to a real employee in the store so the rest of
// the app can render the right user without further wiring.
const ACCOUNTS = [
  {
    email: "employee@corp.com",
    password: "employee123",
    role: "employee",
    userId: "e4", // Rahul Sharma
    label: "Employee · Rahul Sharma",
  },
  {
    email: "hr@corp.com",
    password: "hr123",
    role: "hr",
    userId: "e2", // Priya Verma
    label: "HR · Priya Verma",
  },
  {
    email: "admin@corp.com",
    password: "admin123",
    role: "admin",
    userId: "e0", // Vivek Iyer (CEO)
    label: "Admin · Vivek Iyer",
  },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((s) => s.login);
  const role = useStore((s) => s.role);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from || "/";

  useEffect(() => {
    if (role) navigate(from, { replace: true });
  }, [role, navigate, from]);

  function attempt(creds) {
    const acc = ACCOUNTS.find(
      (a) => a.email === creds.email && a.password === creds.password,
    );
    if (!acc) {
      toast.error("Invalid credentials");
      return;
    }
    login({ role: acc.role, userId: acc.userId });
    toast.success(`Welcome, ${acc.label.split("·")[1]?.trim() || "team"}!`);
    setTimeout(() => navigate(acc.role === "admin" || acc.role === "hr" ? "/admin" : "/", { replace: true }), 250);
  }

  function handleSubmit(e) {
    e.preventDefault();
    attempt({ email: email.trim().toLowerCase(), password });
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Ambient background */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-600/30 blur-[140px] rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-fuchsia-600/30 blur-[140px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-5xl grid lg:grid-cols-5 rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl"
      >
        {/* Editorial side */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between bg-hero-gradient text-white p-10 xl:p-14 relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles size={12} /> Welcome
            </div>
            <h1 className="font-display text-4xl xl:text-5xl font-extrabold mt-6 leading-[1.05]">
              CorpConnect
              <br />
              <span className="text-brand-200/90">your internal stage.</span>
            </h1>
            <p className="mt-5 text-white/80 max-w-md text-base">
              One place for leadership messages, project wins, recognition,
              colleagues and culture — across every team.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-10">
            {[
              { Icon: Users, k: "2,400+", v: "Employees" },
              { Icon: Trophy, k: "562", v: "Recognitions" },
              { Icon: Sparkles, k: "91%", v: "Engagement" },
            ].map(({ Icon, k, v }) => (
              <div key={v} className="bg-white/10 rounded-2xl p-4">
                <Icon size={16} className="text-white/80" />
                <p className="font-display text-2xl font-bold mt-2">{k}</p>
                <p className="text-xs text-white/70">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form side */}
        <div className="lg:col-span-2 bg-white dark:bg-ink-900 p-6 sm:p-10 flex flex-col justify-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink-900 dark:text-ink-100">
              Sign in
            </h2>
            <p className="mt-2 muted text-sm">
              Use one of the demo accounts below or your work email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider muted">
                Work email
              </label>
              <div className="relative mt-1.5">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@corp.com"
                  className="input pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider muted">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-9"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Continue <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 dark:border-ink-800">
            <p className="text-xs uppercase tracking-wider muted font-semibold">
              Quick demo logins
            </p>
            <div className="mt-3 grid gap-2">
              {ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => attempt(a)}
                  className="text-left p-3 rounded-xl border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-xs muted">
                      {a.email} · {a.password}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-ink-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
