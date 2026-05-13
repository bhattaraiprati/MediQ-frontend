import LoginPage from "@/pages/LoginPage"

import { Route, Routes } from "react-router-dom"
import ProtectedRoutes from "./ProtectedRoutes"
import ChatPage from "@/pages/ChatPage"
import AdminDashboard from "@/pages/AdminDashboard"

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoutes  allowedRoles={["user"]}  />}>
        <Route path="/dashboard" element={<ChatPage />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      /> */}
    </Routes>
  );
}

export default AppRoutes