// import React, { useState, useEffect } from "react";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import PageMeta from "../../components/common/PageMeta";
// import { useNavigate } from "react-router";
// import api from "../../utils/axiousInstance"; // Ensure this path is correct

// // Types for our API response
// interface DocumentType {
//   doctype_id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function DocTypeFolder() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState<DocumentType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 1. Fetch dynamic document types from backend
//   useEffect(() => {
//     const fetchDocTypes = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/documents/type");
//         // Accessing response.data.data based on your JSON structure
//         setCategories(response.data.data || []);
//       } catch (err) {
//         console.error("Error fetching doc types:", err);
//         setError("Failed to load document categories.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocTypes();
//   }, []);

//   // 2. Filter logic remains dynamic
//   const filteredCategories = categories.filter((cat) =>
//     cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleFolderClick = (typeName: string) => {
//     navigate(`/documents?type=${encodeURIComponent(typeName)}`);
//   };

//   // Helper to assign colors based on name (optional but keeps UI pretty)
//   const getFolderColor = (name: string) => {
//     if (name.includes("137")) return "text-blue-500";
//     if (name.includes("138")) return "text-green-500";
//     if (name.includes("Birth")) return "text-yellow-500";
//     return "text-purple-500";
//   };

//   return (
//     <>
//       <PageMeta title="Document Categories" description="Organized student documents" />
//       <PageBreadcrumb pageTitle="Document Folders" />

//       <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
//         <div className="mx-auto w-full max-w-[630px] text-center mb-10">
//           <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
//             Document Type Archives
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
//             Access compiled student records organized by category.
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="flex justify-end mb-6">
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search category..."
//               className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center py-20">
//             <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && <div className="text-center text-red-500 py-10">{error}</div>}

//         {/* Folder Grid */}
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {!loading && filteredCategories.map((cat) => (
//             <div
//               key={cat.doctype_id}
//               onClick={() => handleFolderClick(cat.name)}
//               className="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-blue-500/30"
//             >
//               <div className="flex items-start justify-between">
//                 <div className={`${getFolderColor(cat.name)} transition-transform group-hover:scale-110`}>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
//                   </svg>
//                 </div>
//               </div>
              
//               <div className="mt-5">
//                 <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
//                   {cat.name}
//                 </h4>
//                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                   Student Record Category
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }







import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { Modal } from "../../components/ui/modal/index";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router";
import api from "../../utils/axiousInstance";
import { showAlert } from "../../utils/toaster";

interface DocumentType {
  doctype_id: number;
  name: string;
}

export default function DocTypeFolder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const userRole = localStorage.getItem("user_role");

  const fetchDocTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/documents/type");
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching doc types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocTypes();
  }, []);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    showAlert.loading("Creating category...");

    try {
      // Adjust this endpoint based on your backend route for creating types
      await api.post("/documents/type/add", { name: newTypeName });

      showAlert.success("Success!", `${newTypeName} category has been added.`);
      setNewTypeName("");
      setIsModalOpen(false);
      fetchDocTypes(); // Refresh the list
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create category.";
      showAlert.error("Oops!", msg);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = (typeName: string) => {
    navigate(`/documents?type=${encodeURIComponent(typeName)}`);
  };

  const getFolderColor = (name: string) => {
    if (name.includes("137")) return "text-blue-500";
    if (name.includes("138")) return "text-green-500";
    if (name.includes("Birth")) return "text-yellow-500";
    return "text-purple-500";
  };

  return (
    <>
      <PageMeta title="Document Categories" description="Organized student documents" />
      <PageBreadcrumb pageTitle="Document Folders" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center mb-10">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Document Type Archives
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Access and manage student records by category.
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category..."
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Check: Only Non-Staff can add categories */}
          {userRole !== "Staff" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-95"
            >
              <PlusIcon /> New Category
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.doctype_id}
                onClick={() => handleFolderClick(cat.name)}
                className="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-blue-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className={`${getFolderColor(cat.name)} transition-transform group-hover:scale-110`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">{cat.name}</h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Student Record Category</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[450px] p-6 sm:p-8 z-500"
      >
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Document Type
          </h4>
          <p className="mb-6 text-sm text-gray-500">
            Create a new classification for student documents (e.g., Diploma, Good Moral).
          </p>
          <form onSubmit={handleCreateType} className="space-y-4">
            <div className="text-left">
              <Label>Category Name</Label>
              <Input
                type="text"
                placeholder="e.g., Diploma"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}