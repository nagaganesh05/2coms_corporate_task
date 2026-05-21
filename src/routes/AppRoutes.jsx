import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Feed from "../pages/Feed";
import Recognition from "../pages/Recognition";
import Directory from "../pages/Directory";
import Events from "../pages/Events";
import KnowledgeHub from "../pages/KnowledgeHub";
import Notifications from "../pages/Notifications";
import AdminDashboard from "../pages/AdminDashboard";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="feed" element={<Feed />} />
        <Route path="recognition" element={<Recognition />} />
        <Route path="directory" element={<Directory />} />
        <Route path="events" element={<Events />} />
        <Route path="knowledge" element={<KnowledgeHub />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
