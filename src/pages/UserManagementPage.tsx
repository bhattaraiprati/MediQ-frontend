import { getUserDetails } from "@/lib/dashboardApi";
import { useQuery } from "@tanstack/react-query";
import { Search, UserCheck } from "lucide-react";
import { useState } from "react";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  status: string;
}

interface ApiResponse {
  success: boolean;
  users: UserDetails[];
}

export const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Filter users based on search
  const filteredUsers = userData?.users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-gray-300 px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900"></h1>
          
          <div className="flex items-center gap-3">
            {/* You can add "Add User" button here later */}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-8">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5">
            <div className="flex-1 min-w-[320px] flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300 text-xs font-semibold text-gray-500 px-8 py-4">
              <div className="col-span-1">Profile</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">status</div>
              <div className="col-span-2">Action</div>
            </div>

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 px-8 py-5 border-b border-gray-300 last:border-none hover:bg-gray-50 transition-all items-center"
                >
                  {/* Profile Picture */}
                  <div className="col-span-1">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/40?text=User";
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div className="col-span-3 font-medium text-gray-900">
                    {user.name}
                  </div>

                  {/* Email */}
                  <div className="col-span-3 text-gray-600 text-sm">
                    {user.email}
                  </div>
                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex gap-2">
                    {/* Toggle Active/Inactive Button */}
                    <button
                      // onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                        user.status === "active"
                          ? "text-orange-600 hover:bg-orange-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>

                  </div>
                </div>


              ))
            ) : (
              <div className="p-20 text-center text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};