import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Feed from "../pages/Feed";
import Recognition from "../pages/Recognition";
import Directory from "../pages/Directory";
import Teams from "../pages/Teams";
import Events from "../pages/Events";
import Forum from "../pages/Forum";
import Gallery from "../pages/Gallery";
import KnowledgeHub from "../pages/KnowledgeHub";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

import AdminDashboard from "../pages/AdminDashboard";
import ContentManagement from "../pages/ContentManagement";
import Moderation from "../pages/Moderation";
import Analytics from "../pages/Analytics";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated app */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="feed" element={<Feed />} />
        <Route path="recognition" element={<Recognition />} />
        <Route path="directory" element={<Directory />} />
        <Route path="teams" element={<Teams />} />
        <Route path="events" element={<Events />} />
        <Route path="forum" element={<Forum />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="knowledge" element={<KnowledgeHub />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin / HR — role-gated */}
        <Route
          path="admin"
          element={
            <ProtectedRoute roles={["admin", "hr"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/content"
          element={
            <ProtectedRoute roles={["admin", "hr"]}>
              <ContentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/moderation"
          element={
            <ProtectedRoute roles={["admin", "hr"]}>
              <Moderation />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <ProtectedRoute roles={["admin", "hr"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
