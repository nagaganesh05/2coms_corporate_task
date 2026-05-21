import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@corp.com" && password === "admin123") {
      toast.success("Admin Login Successful");

      localStorage.setItem("role", "admin");

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } else if (email === "employee@corp.com" && password === "employee123") {
      toast.success("Employee Login Successful");

      localStorage.setItem("role", "employee");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 rounded-[40px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl"
      >
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-16">
          <h1 className="text-6xl font-black leading-tight">CorpConnect</h1>

          <p className="mt-6 text-xl text-blue-100 leading-relaxed">
            Unified employee engagement, collaboration, leadership communication
            and enterprise culture platform.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-12">
            <div className="bg-white/10 rounded-3xl p-6">
              <h2 className="text-5xl font-bold">2400+</h2>
              <p className="mt-3 text-blue-100">Employees</p>
            </div>

            <div className="bg-white/10 rounded-3xl p-6">
              <h2 className="text-5xl font-bold">18+</h2>
              <p className="mt-3 text-blue-100">Departments</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 lg:p-16 flex flex-col justify-center">
          <div>
            <h2 className="text-5xl font-black text-slate-900">Welcome Back</h2>

            <p className="mt-4 text-slate-500 text-lg">
              Login to continue to your corporate workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-10 space-y-6">
            <div>
              <label className="font-semibold text-slate-700">
                Corporate Email
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-3 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-3 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300">
              Login
            </button>
          </form>

          <div className="mt-8 bg-slate-100 rounded-3xl p-5">
            <h3 className="font-bold text-slate-800">Demo Credentials</h3>

            <div className="mt-4 text-slate-700 space-y-2">
              <p>Employee: employee@corp.com / employee123</p>

              <p>Admin: admin@corp.com / admin123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
