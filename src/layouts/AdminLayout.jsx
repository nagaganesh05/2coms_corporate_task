import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-slate-50">
        <Navbar />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
