import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import MobileBottomNav from "../components/common/MobileBottomNav";

function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Drawer closes itself when any nav item is clicked (Sidebar wires
  // onMobileClose into each NavLink). No effect needed here.

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 lg:px-6 py-5 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {/* Smooth, subtle page transitions on route change */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default MainLayout;
