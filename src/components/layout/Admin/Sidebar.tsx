import LogoBlack from "@/components/ui/LogoBlack";
import PopupModel from "@/components/ui/PopupModel";
import { getProfileUrl } from "@/lib/dashboardApi";
import { useQuery } from "@tanstack/react-query";
import { FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

 interface ProfileImg {
  profilePicture: string;
}

 interface ProfileResponse {
  message: boolean;
  profileImg: ProfileImg;
}
export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { data: profileData, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: getProfileUrl,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Show loading state
  if (isLoading) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gray-300 animate-pulse flex items-center justify-center">
        {/* Optional: You can put a spinner here */}
      </div>
    );
  }

  // Handle error
  if (error || !profileData?.profileImg?.profilePicture) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gray-500 flex items-center justify-center text-white text-xs font-semibold">
        ?
      </div>
    );
  }

  const profilePicture = profileData.profileImg.profilePicture;

  const navItems = [
    {
      group: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      ],
    },
    {
      group: "Management",
      items: [
        { icon: FileText, label: "Documents", path: "/admin/documents", badge: "2" },
        { icon: Users, label: "Users", path: "/admin/users" },
      ],
    },
  ];

 const handleLogout = async () => {
  // Your logout logic here
  try {
    // await logoutApi();
    console.log("User logged out");
    localStorage.removeItem("mediq_token")
    localStorage.removeItem( "mediq_user")

    // Redirect or clear session
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <LogoBlack />
          <span className="px-3 py-1 text-xs font-semibold bg-brand/10 text-brand rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {navItems.map(({ group, items }) => (
          <div key={group}>
            <div className="uppercase text-xs font-semibold text-gray-500 px-4 mb-3">
              {group}
            </div>
            {items.map(({ icon, label, path, badge }) => (
              <NavItem
                key={path}
                icon={icon}
                label={label}
                badge={badge}
                active={location.pathname === path}
                onClick={() => navigate(path)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold">
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png'; 
              }}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Super Administrator</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
          <LogOut 
            onClick={() => setShowLogoutModal(true)} 
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" 
          />
        </div>
      </div>
      <PopupModel
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        content="Are you sure you want to log out?"
        buttonContent="Logout"
        buttonVariant="danger"
        onConfirm={handleLogout}
      />
    </div>
  );
};

function NavItem({ icon: Icon, label, badge, active, onClick }: {
  icon: React.ElementType;
  label: string;
  badge?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-sm ${
        active ? "bg-brand/10 text-brand font-medium" : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}