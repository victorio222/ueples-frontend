import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

const initialData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

export default function BasicTableOne() {
  const [tableData, setTableData] = useState<Order[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    projectName: "",
    budget: "",
    status: "Active"
  });

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: Order = {
      id: tableData.length + 1,
      user: {
        image: "/images/user/user-01.jpg", // Default placeholder
        name: formData.name,
        role: formData.role,
      },
      projectName: formData.projectName,
      team: {
        images: ["/images/user/user-22.jpg"], // Default team set
      },
      budget: formData.budget,
      status: formData.status,
    };

    setTableData([newUser, ...tableData]);
    setIsModalOpen(false);
    setFormData({ name: "", role: "", projectName: "", budget: "", status: "Active" });
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          User Management
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all active:scale-95"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Project Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Team</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Budget</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                        <img width={40} height={40} src={order.user.image} alt={order.user.name} />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{order.user.name}</span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{order.user.role}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{order.projectName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div key={index} className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900">
                          <img width={24} height={24} src={teamImage} alt="team" className="w-full size-6" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={order.status === "Active" ? "success" : order.status === "Pending" ? "warning" : "error"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{order.budget}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* NEW USER MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200 dark:bg-gray-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Register New User</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-200">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddNewUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label>First Name</Label>
                  <Input type="text" name="firstName" placeholder="First name"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>Middle Name</Label>
                  <Input type="text" name="middleName" placeholder="Middle name"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>Last Name</Label>
                  <Input type="text" name="lastName" placeholder="Last name"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>Suffix Name</Label>
                  <Input type="text" name="suffixName" placeholder="Suffix name"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>Email address</Label>
                  <Input type="email" name="email" placeholder="e.g., uep.staff@edu.ph"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>Status</Label>
                  <Input type="text" name="firstName" placeholder="Status"></Input>
                  {/* <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  /> */}
                </div>
              </div>

              {/* <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="Website Redesign"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                />
              </div> */}

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select 
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
              </div> */}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}