import LoginPage from "@/pages/LoginPage"

import { Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./ProtectedRoutes"
import ChatPage from "@/pages/ChatPage"
import AdminDashboard from "@/pages/AdminDashboard"
import AdminLayout from "@/components/layout/Admin/AdminLayout"
import { DocumentPage } from "@/pages/DocumentPage"

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoutes  allowedRoles={["user"]}  />}>
        <Route path="/dashboard" element={<ChatPage />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<DocumentPage />} />
          {/* <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} /> */}
        </Route>
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Route>

      {/* <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      /> */}
    </Routes>
  );
}

export default AppRoutes