import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";

// Assuming you'll pass userData as a prop like the previous component
export default function UserInfoCard({
  userData,
  onUpdate,
}: {
  userData: any;
  onUpdate: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  // Local state for the form inputs
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    bio: "",
    facebook: "https://www.facebook.com/",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/company/",
    instagram: "https://instagram.com/",
  });

  // Sync state when userData is available or modal opens
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        bio: userData.bio || "",
        facebook: userData.facebook || "https://www.facebook.com/",
        x: userData.x || "https://x.com/",
        linkedin: userData.linkedin || "https://www.linkedin.com/company/",
        instagram: userData.instagram || "https://instagram.com/",
      });
    }
  }, [userData, isOpen]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.first_name
                  ? `${userData.first_name} ${userData.middle_name || ""} ${userData.last_name} ${userData.suffix_name || ""}`.trim()
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Gender
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.gender || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.phone_number || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
