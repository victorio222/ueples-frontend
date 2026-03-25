import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { toast } from "react-hot-toast";
import { User } from "../../../types/models";
import { UserService } from "../../../api/services/userService";
import { getVisiblePages } from "../../../utils/paginationHelper";
import { showAlert } from "../../../utils/toaster";
import { PlusIcon } from "../../../icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Role {
  role_id: number;
  role_name: string;
}

export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    email: "",
    status: "Active",
    role_id: "",
    password: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        UserService.getAll(),
        UserService.getRoles(),
      ]);

      // Extracting from { status: "success", data: [...] }
      const userData = userRes.data.data || [];
      const roleData = roleRes.data.data || [];

      setUsers(userData);
      setRoles(roleData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Could not load system data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleRefresh = () => fetchData();
    window.addEventListener("userUpdated", handleRefresh);
    return () => window.removeEventListener("userUpdated", handleRefresh);
  }, []);

  // --- SEARCH & FILTER LOGIC ---
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const previousUsers = [...users];

    // Optimistic Update
    setUsers(
      users.map((u) =>
        u.user_id === userId ? { ...u, status: newStatus } : u,
      ),
    );

    try {
      await UserService.updateStatus(userId, newStatus);
      toast.success(`User is now ${newStatus}`); // Keeping Toaster for Status
    } catch (error) {
      setUsers(previousUsers);
      toast.error("Failed to update status");
    }
  };

  const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
    let retVal = "";
    for (let i = 0; i < 10; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password: retVal }));
    toast.success("Temporary password generated!");
  };

  const handleAddNewUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // SweetAlert Loading
    showAlert.loading("Processing registration...");

    try {
      await UserService.create(formData);

      // SweetAlert Success
      await showAlert.success(
        "Registration Successful",
        `${formData.first_name} has been added to the system.`,
      );

      fetchData();
      setIsModalOpen(false);
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix_name: "",
        email: "",
        status: "Active",
        role_id: "",
        password: "",
      });
      setCurrentPage(1);
    } catch (error: any) {
      const msg =
        error.response?.data?.errors?.[0]?.msg || "Registration failed";
      // SweetAlert Error
      showAlert.error("Registration Failed", msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            System Users
          </h3>
          <p className="text-sm text-gray-400">
            Manage administrative and staff access levels.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 flex-wrap md:flex-nowrap sm:flex-wrap">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search users..."
              className="h-10 rounded-lg border w-full sm:w-full border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 dark:bg-white/[0.03] dark:border-white/10 dark:text-white"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <svg
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center w-30 md:w-41 sm:w-41 h-10 gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
          >
            <div className="text-lg">
              <PlusIcon />
            </div>
            Add User
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-semibold text-gray-400 uppercase"
                >
                  User Details
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-semibold text-gray-400 uppercase"
                >
                  Email Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-semibold text-gray-400 uppercase"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-xs text-center font-semibold text-gray-400 uppercase"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-gray-400 italic"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <TableRow
                    key={user.user_id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-600/10">
                          <img
                            src={
                              user.user_image
                                ? `${API_BASE_URL}/uploads/user_profiles/${user.user_image}`
                                : `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=DBEAFE&color=2563EB`
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium dark:text-gray-300">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-300">
                        {user?.role?.role_name || "Staff"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 flex justify-center">           
                      <button
                        onClick={() =>
                          handleToggleStatus(user.user_id, user.status)
                        }
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${user.status === "Active" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        >
                          <span
                            className={`h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${user.status === "Active" ? "translate-x-5.5" : "translate-x-1"}`}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold ${user.status === "Active" ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {user.status}
                        </span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-gray-400 text-sm"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <p className="text-xs text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-700 dark:text-white">
              {currentPage}
            </span>{" "}
            of {totalPages}
          </p>

          <div className="flex items-center gap-1">
            {/* Jump to First Page */}
            {currentPage > 3 && (
              <button
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600"
              >
                First
              </button>
            )}

            {/* Previous Arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dynamic Numbered Buttons (Interval of 5) */}
            <div className="flex items-center gap-1">
              {getVisiblePages(totalPages, currentPage).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Jump to Last Page */}
            {currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600"
              >
                Last
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b p-6 dark:border-gray-800">
              <h4 className="text-lg font-semibold dark:text-slate-200">Register New User</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>First Name</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Last Name</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label>System Role</Label>
                  <select
                    className="text-slate-300 w-full h-11 rounded-lg border px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                    value={formData.role_id}
                    onChange={(e) =>
                      setFormData({ ...formData, role_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.role_id} value={r.role_id}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 space-y-1">
                  <Label>Initial Status</Label>
                  <select
                    className="text-slate-300 w-full h-11 rounded-lg border px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label>Temporary Password</Label>
                  <div className="relative">
                    <Input
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-normal rounded-lg hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
