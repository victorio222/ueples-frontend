import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { UserService } from "../../api/services/userService";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.API_BASE_URL;

export default function UserMetaCard({
  userData,
  onUpdate,
}: {
  userData: any;
  onUpdate: () => void;
}) {
  const profileModal = useModal();
  const passwordModal = useModal();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    email: "",
    phone_number: "",
    gender: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // SYNC LOGIC: Updates local form state when userData prop changes
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        last_name: userData.last_name || "",
        suffix_name: userData.suffix_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        gender: userData.gender || "Male",
      });
      // Clear local file states when parent data updates (sync complete)
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [userData]); // Trigger whenever parent re-fetches data

  // Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      dataPayload.append(key, value)
    );
    if (selectedFile) dataPayload.append("user_image", selectedFile);

    toast.promise(
      UserService.update(userData.user_id, dataPayload),
      {
        loading: "Updating profile...",
        success: () => {
          onUpdate(); // Re-fetch data in parent
          profileModal.closeModal();
          setLoading(false);
          window.location.reload();
          window.dispatchEvent(new Event("profileUpdated"));
          return "Profile updated successfully!";
        },
        error: (err) => {
          setLoading(false);
          return err.response?.data?.message || "Update failed";
        },
      }
    );
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    toast.promise(
      UserService.updatePassword(userData.user_id, {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      }),
      {
        loading: "Changing password...",
        success: () => {
          setPasswordData({
            old_password: "",
            new_password: "",
            confirm_password: "",
          });
          passwordModal.closeModal();
          setLoading(false);
          return "Password updated successfully!";
        },
        error: (err) => {
          setLoading(false);
          return err.response?.data?.message || "Update failed";
        },
      }
    );
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              {userData?.user_image ? (
                <img
                  src={`${API_BASE_URL}/uploads/user_profiles/${userData.user_image}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {userData?.first_name?.[0]}
                  {userData?.last_name?.[0]}
                </span>
              )}
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userData?.first_name} {userData?.last_name}
                <span
                  className={`mx-2 text-xs px-2 py-1 rounded-full font-medium ${
                    userData?.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {userData?.status}
                </span>
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {userData?.role?.role_name}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={profileModal.openModal}
              className="flex items-center justify-center w-33 gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              Edit Profile
            </button>
            <button
              onClick={passwordModal.openModal}
              className="flex items-center justify-center w-33 gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Edit Profile */}
      <Modal
        isOpen={profileModal.isOpen}
        onClose={profileModal.closeModal}
        className="max-w-[700px] m-4 z-200"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h4>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                {previewUrl || userData?.user_image ? (
                  <img
                    src={
                      previewUrl ||
                      `${API_BASE_URL}/uploads/user_profiles/${userData.user_image}`
                    }
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {formData.first_name?.[0]}
                    {formData.last_name?.[0]}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                />
                <Button size="sm" variant="outline" type="button">
                  Change Photo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({ ...formData, middle_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Suffix Name</Label>
                <Input
                  type="text"
                  value={formData.suffix_name}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={profileModal.closeModal}
                type="button"
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* MODAL 2: Change Password */}
      <Modal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.closeModal}
        className="max-w-[500px] m-4 z-99999"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Security Settings
          </h4>
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
              />
            </div>
            <hr className="border-gray-100 dark:border-gray-800" />
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={passwordModal.closeModal}
                type="button"
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}