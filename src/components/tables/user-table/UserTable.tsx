// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import Badge from "../../ui/badge/Badge";
// import Label from "../../form/Label";
// import Input from "../../form/input/InputField";
// import { toast } from "react-hot-toast";
// import api from "../../../utils/axiousInstance";
// import { User } from "../../../types/models";
// import { UserService } from "../../../api/services/userService";

// // Define Role interface based on your back-end structure
// interface Role {
//   role_id: number;
//   role_name: string;
// }

// export default function BasicTableOne() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]); // State for dynamic roles
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     suffix_name: "",
//     email: "",
//     status: "Active",
//     role_id: "", // Changed to ID for dynamic selection
//     password: "",
//   });

//   // HELPER: Generate a secure random password
//   const generateRandomPassword = () => {
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
//     let retVal = "";
//     for (let i = 0; i < 10; ++i) {
//       retVal += charset.charAt(Math.floor(Math.random() * charset.length));
//     }
//     setFormData((prev) => ({ ...prev, password: retVal }));
//     toast.success("Temporary password generated!");
//   };

//   // HELPER: Copy password to clipboard
//   const copyToClipboard = () => {
//     if (!formData.password) return;
//     navigator.clipboard.writeText(formData.password);
//     toast.success("Password copied to clipboard!");
//   };

//   // FETCH DATA (Users and Roles)
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [userRes, roleRes] = await Promise.all([
//         api.get("/users"),
//         api.get("/roles"), // Fetching dynamic roles
//       ]);
//       setUsers(userRes.data.data || userRes.data);
//       setRoles(roleRes.data.data || roleRes.data);
//     } catch (error) {
//       console.error("Failed to fetch data", error);
//       toast.error("Could not load system data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const handleRefresh = () => fetchData();
//     window.addEventListener("userUpdated", handleRefresh);
//     return () => window.removeEventListener("userUpdated", handleRefresh);
//   }, []);

//   const handleAddNewUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.password) {
//       toast.error("Please generate or enter a password");
//       return;
//     }
//     if (!formData.role_id) {
//       toast.error("Please select a user role");
//       return;
//     }

//     try {
//       await UserService.create(formData);
//       toast.success("User registered successfully!");
//       window.dispatchEvent(new Event("userUpdated"));
//       setIsModalOpen(false);
//       setFormData({
//         first_name: "",
//         middle_name: "",
//         last_name: "",
//         suffix_name: "",
//         email: "",
//         status: "Active",
//         role_id: "",
//         password: "",
//       });
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           System Users
//         </h3>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all active:scale-95"
//         >
//           <svg
//             className="size-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           Add User
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         <div className="max-w-full overflow-x-auto">
//           <Table>
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   User
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Email
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Role
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   Status
//                 </TableCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {loading ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className="py-10 text-center text-gray-400"
//                   >
//                     Loading users...
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 users.map((user) => (
//                   <TableRow
//                     key={user.user_id}
//                     className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
//                   >
//                     <TableCell className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold uppercase">
//                           {user.first_name[0]}
//                           {user.last_name[0]}
//                         </div>
//                         <div>
//                           <span className="block font-medium text-gray-800 dark:text-white/90">
//                             {`${user.first_name} ${user.last_name}`}
//                           </span>
//                           <span className="block text-gray-500 text-xs">
//                             ID: #{user.user_id}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="px-5 py-4 text-gray-500 text-sm">
//                       {user.email}
//                     </TableCell>
//                     <TableCell className="px-5 py-4 text-gray-500 text-sm">
//                       {user?.role?.role_name}
//                     </TableCell>
//                     <TableCell className="px-5 py-4">
//                       <Badge
//                         size="sm"
//                         color={user.status === "Active" ? "success" : "error"}
//                       >
//                         {user.status}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border dark:border-gray-800">
//             <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
//               <h4 className="text-lg font-semibold dark:text-white">
//                 Register New User
//               </h4>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <svg
//                   className="size-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleAddNewUser} className="p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>First Name</Label>
//                   <Input
//                     value={formData.first_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, first_name: e.target.value })
//                     }
//                     placeholder="First name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Middle Name</Label>
//                   <Input
//                     value={formData.middle_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, middle_name: e.target.value })
//                     }
//                     placeholder="Optional"
//                   />
//                 </div>
//                 <div>
//                   <Label>Last Name</Label>
//                   <Input
//                     value={formData.last_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, last_name: e.target.value })
//                     }
//                     placeholder="Last name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Suffix</Label>
//                   <Input
//                     value={formData.suffix_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, suffix_name: e.target.value })
//                     }
//                     placeholder="Jr./III"
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Label>Email address</Label>
//                   <Input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     placeholder="uep.staff@edu.ph"
//                     required
//                   />
//                 </div>

//                 {/* DYNAMIC ROLE SELECT */}
//                 <div className="col-span-1">
//                   <Label>User Role</Label>
//                   <select
//                     className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
//                     value={formData.role_id}
//                     onChange={(e) =>
//                       setFormData({ ...formData, role_id: e.target.value })
//                     }
//                     required
//                   >
//                     <option
//                       value=""
//                       disabled
//                       className="text-gray-400 dark:bg-gray-900"
//                     >
//                       Select Role
//                     </option>
//                     {roles.map((role) => (
//                       <option
//                         key={role.role_id}
//                         value={role.role_id}
//                         className="text-gray-800 dark:bg-gray-900 dark:text-white/90"
//                       >
//                         {role.role_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* ACCOUNT STATUS SELECT */}
//                 <div className="col-span-1">
//                   <Label>Account Status</Label>
//                   <select
//                     className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
//                     value={formData.status}
//                     onChange={(e) =>
//                       setFormData({ ...formData, status: e.target.value })
//                     }
//                   >
//                     <option
//                       value="Active"
//                       className="text-gray-800 dark:bg-gray-900 dark:text-white/90"
//                     >
//                       Active
//                     </option>
//                     <option
//                       value="Inactive"
//                       className="text-gray-800 dark:bg-gray-900 dark:text-white/90"
//                     >
//                       Inactive
//                     </option>
//                   </select>
//                 </div>

//                 {/* Password Generation */}
//                 <div className="col-span-2">
//                   <Label>Temporary Password</Label>
//                   <div className="flex gap-2">
//                     <div className="relative flex-1">
//                       <Input
//                         value={formData.password}
//                         onChange={(e) =>
//                           setFormData({ ...formData, password: e.target.value })
//                         }
//                         placeholder="Click generate"
//                         required
//                       />
//                       {formData.password && (
//                         <button
//                           type="button"
//                           onClick={copyToClipboard}
//                           className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
//                           title="Copy to clipboard"
//                         >
//                           <svg
//                             className="size-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
//                             />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={generateRandomPassword}
//                       className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
//                     >
//                       Generate
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-800">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
//                 >
//                   Add User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
import api from "../../../utils/axiousInstance";
import { User } from "../../../types/models";
import { UserService } from "../../../api/services/userService";

interface Role {
  role_id: number;
  role_name: string;
}

export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // Access the .data from Axios, then the .data from your ApiResponse structure
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

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // Optimistic UI Update: change UI immediately
    const previousUsers = [...users];
    setUsers(
      users.map((u) =>
        u.user_id === userId ? { ...u, status: newStatus } : u,
      ),
    );

    try {
      // Pass both ID and Status to the service
      await UserService.updateStatus(userId, newStatus);
      toast.success(`User is now ${newStatus}`);
    } catch (error) {
      // Rollback UI if API fails
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
    try {
      await UserService.create(formData);
      toast.success("User registered successfully!");
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
    } catch (error: any) {
      const msg =
        error.response?.data?.errors?.[0]?.msg || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          System Users
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
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
                    className="py-10 text-center text-gray-400"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.user_id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </div>
                        <div>
                          <span className="block font-medium text-sm text-gray-800 dark:text-white/90">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="block text-gray-500 text-xs">
                            ID: #{user.user_id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-sm">
                      <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs capitalize">
                        {user?.role?.role_name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <button
                        onClick={() =>
                          handleToggleStatus(user.user_id, user.status)
                        }
                        className="flex items-center gap-3 group focus:outline-none"
                      >
                        <div
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${user.status === "Active" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${user.status === "Active" ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium transition-colors ${user.status === "Active" ? "text-green-600" : "text-gray-400"}`}
                        >
                          {user.status}
                        </span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900 border dark:border-gray-800">
            <div className="flex items-center justify-between border-b p-6 dark:border-gray-800">
              <h4 className="text-lg font-semibold dark:text-white">
                Register New Staff
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
                    placeholder="Jane"
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
                    placeholder="Doe"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="jane.doe@uep.edu.ph"
                    required
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <Label>Role</Label>
                  <select
                    className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-blue-500"
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
                    className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-blue-500"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                {/* Temporary Password Row */}
                <div className="col-span-2 space-y-1.5">
                  <Label>Temporary Password</Label>
                  <div className="relative group">
                    <Input
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      required
                      className="pr-24 h-12 w-full transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 italic">
                    Note: Users will be asked to change this upon first login.
                  </p>
                </div>
                {/* <div className="col-span-2 space-y-1">
                  <Label>Temporary Password</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      required
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="px-4 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
