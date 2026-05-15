// src/layouts/AdminLayout.tsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}