import LoginPage from "@/pages/LoginPage"
import { Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./ProtectedRoutes"
import ChatPage from "@/pages/ChatPage"
import AdminDashboard from "@/pages/AdminDashboard"
import AdminLayout from "@/components/layout/Admin/AdminLayout"
import { DocumentPage } from "@/pages/DocumentPage"
import { UserManagePage } from "@/pages/UserManagePage"
import ChangePasswordPage from "@/pages/ChangePasswordPage"

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoutes  allowedRoles={["user"]}  />}>
        <Route path="/dashboard" element={<ChatPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<DocumentPage />} />
          <Route path="/admin/users" element={<UserManagePage/>} />
          <Route path="/admin/change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default AppRoutes