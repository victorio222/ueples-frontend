import { useState, useEffect, useCallback } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { UserService } from "../api/services/userService";
import { toast } from "react-hot-toast";

export default function UserProfiles() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchProfile = useCallback(async () => {
    const userId = localStorage.getItem("user_id")
    try {
      setLoading(true);
      // Assuming you want to fetch user ID 1 (Admin User)
      const response = await UserService.getById(Number(userId));
      
      // Extract the user object from your ApiResponse structure
      if (response.data && response.data.data) {
        setUserData(response.data.data);
      } else {
        // Fallback for different response shapes
        setUserData(response.data);
      }
    } catch (error: any) {
      console.error("Profile Fetch Error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1); // Triggers re-fetch
  };

  if (loading && !userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Profile | UEP Admin"
        description="User profile management page"
      />
      <PageBreadcrumb pageTitle="Profile" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        
        <div className="space-y-6">
          {/* Main Card: Handles Avatar and Basic Identity */}
          <UserMetaCard 
            userData={userData} 
            onUpdate={handleUpdate} 
          />
          
          {/* Info Card: Handles Bio/Personal Details */}
          <UserInfoCard 
            userData={userData} 
            onUpdate={handleUpdate} 
          />
        </div>
      </div>
    </>
  );
}