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
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { DocumentType } from "../../types/models";
import API from "../../api";

export default function DocTypeFolder() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [importBatches, setImportBatches] = useState(false);

  // --- NEW STATES FOR ACTIONS ---
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentType | null>(
    null,
  );
  const [editNameValue, setEditNameValue] = useState("");

  const userRole = localStorage.getItem("user_role") ?? "";

  const fetchDocTypes = async () => {
    try {
      setLoading(true);
      const response = await API.docs.getTypes();
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
    const trimmedName = newTypeName.trim();
    if (!trimmedName)
      return showAlert.error("Oops!", "Category name cannot be empty.");
    showAlert.loading("Creating category...");
    try {
      await api.post("/documents/type/add", {
        name: trimmedName,
        isBatchesImported: importBatches,
      });
      showAlert.success("Success!", `${trimmedName} category has been added.`);
      setNewTypeName("");
      setIsModalOpen(false);
      setImportBatches(false);
      fetchDocTypes();
    } catch (err: any) {
      showAlert.error(
        "Oops!",
        err.response?.data?.message || "Failed to create category.",
      );
    }
  };

  // --- NEW ACTION HANDLERS ---
  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !editNameValue.trim()) return;
    showAlert.loading("Updating...");
    try {
      await api.put(`/documents/type/${selectedCategory.doctype_id}/update`, {
        name: editNameValue.trim(),
      });
      showAlert.success("Updated!", "Category renamed successfully.");
      setIsEditModalOpen(false);
      fetchDocTypes();
    } catch (err: any) {
      showAlert.error(
        "Error",
        err.response?.data?.message || "Failed to update.",
      );
    }
  };

  const handleDeleteType = async (id: number, name: string) => {
    // 1. Wait for the SweetAlert2 confirmation
    const result = await showAlert.confirm(
      "Are you sure?",
      `You are about to delete the "${name}" category.`,
    );

    // 2. Check if the user actually clicked "Yes"
    if (result.isConfirmed) {
      showAlert.loading("Deleting...");
      try {
        await api.delete(`/documents/type/${id}`);
        // showAlert.success handles its own closing of the loading state
        await showAlert.success("Deleted", "Category removed successfully.");
        fetchDocTypes();
      } catch (err: any) {
        showAlert.error("Error", "Could not delete category.");
      }
    }
  };

  const filteredCategories = categories
    .filter((cat) => {
      // 1. Keep the search functionality
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 2. Apply Intern-specific restriction
      if (userRole === "Intern") {
        // Only return true if it matches search AND is an imported batch
        return matchesSearch && cat.isBatchesImported === true;
      }

      // 3. For Admin/Staff, just return the search match
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleFolderClick = (typeName: string) => {
    navigate(`/documents?type=${encodeURIComponent(typeName)}`);
  };

  return (
    <>
      <PageMeta
        title="Document Categories"
        description="Organized student documents"
      />
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

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category..."
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                className="group relative cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-blue-500/30"
              >
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => handleFolderClick(cat.name)}
                    className="text-blue-500 transition-transform group-hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-14 w-14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
                    </svg>
                  </div>

                  {/* THREE DOT MENU */}
                  {!["Staff", "Intern"].includes(userRole) && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === cat.doctype_id
                              ? null
                              : cat.doctype_id,
                          );
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiMoreVertical className="text-gray-500" />
                      </button>

                      {activeMenu === cat.doctype_id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(cat);
                              setEditNameValue(cat.name);
                              setIsEditModalOpen(true);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FiEdit size={14} /> Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteType(cat.doctype_id, cat.name);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className="mt-5"
                  onClick={() => handleFolderClick(cat.name)}
                >
                  <h4 className="text-lg capitalize font-bold text-gray-800 dark:text-white/90">
                    {cat.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Student Record Category
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[450px] p-6 z-99999"
      >
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">
          Add Document Type
        </h4>
        <form onSubmit={handleCreateType} className="space-y-4">
          <Label>Category Name</Label>
          <Input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="importBatches"
              checked={importBatches}
              onChange={(e) => setImportBatches(e.target.checked)}
            />
            <label
              htmlFor="importBatches"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Import academic batches 
            </label>
          </div>
          <p className="text-slate-500 text-xs">Note: This will import or generate all academic batches for the new category/folder.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* NEW: Rename Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-w-[450px] p-6 z-200"
      >
        <h4 className="mb-2 text-2xl font-semibold text-center">
          Rename Category
        </h4>
        <form onSubmit={handleUpdateType} className="space-y-4">
          <Label>New Category Name</Label>
          <Input
            type="text"
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 border py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
