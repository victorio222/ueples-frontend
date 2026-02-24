import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { Modal } from "../../components/ui/modal/index";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useLocation, useNavigate } from "react-router";
import API from "../../api";
import { AcademicYear } from "../../types/models";
import { showAlert } from "../../utils/toaster"; // Import helper

export default function FormFolder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [folders, setFolders] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type");

  const userRole = localStorage.getItem("user_role");

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await API.years.getAll();
      setFolders(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const sortedFolders = [...folders].sort((a, b) =>
    b.academic_year.localeCompare(a.academic_year),
  );

  const filteredFolders = sortedFolders.filter((f) =>
    f.academic_year.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear) return;

    // 1. Show Loading State
    showAlert.loading("Creating folder...");

    try {
      await API.years.create(newYear);

      // 2. Success Alert
      await showAlert.success(
        "Created!",
        `Academic Year ${newYear} is now available.`,
      );

      setNewYear("");
      setIsModalOpen(false);
      fetchFolders();
    } catch (err: any) {
      // 3. Error Alert
      const msg =
        err.response?.data?.message ||
        "Failed to create folder. Please try again.";
      showAlert.error("Oops!", msg);
    }
  };

  const handleFolderClick = (year: string) => {
    if (selectedType) {
      // If we came from the "Document Type" folder, pass the type forward
      navigate(`/archive/${year}?type=${encodeURIComponent(selectedType)}`);
    } else {
      // Default behavior
      navigate(`/archive/${year}`);
    }
  };

  return (
    <>
      <PageMeta
        title="Document Folder"
        description="Form 137 folders for UEP Student Archives"
      />
      <PageBreadcrumb pageTitle="Folders" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center mb-10">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Student Record Archives
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Access compiled Form 137 documents organized by academic year. Click
            a folder to view individual student files.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search year..."
              className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-4 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* {userRole !== "Staff" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-95"
            >
              <PlusIcon /> New Folder
            </button>
          )} */}
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto text-sm bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors active:scale-95"
          >
            <PlusIcon /> New Folder
          </button> */}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Loading folders...</p>
          </div>
        )}

        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {!loading && filteredFolders.length > 0
            ? filteredFolders.map((folder) => (
                <div
                  key={folder.year_id}
                  onClick={() => handleFolderClick(folder.academic_year)}
                  className="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:border-blue-200 hover:bg-blue-50/30 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-blue-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-blue-500 transition-transform group-hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Z" />
                      </svg>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600 shadow-sm dark:bg-gray-800">
                      Active
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">
                      Batch {folder.academic_year}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Student Records
                    </p>
                  </div>
                </div>
              ))
            : !loading && (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No folders found.
                </div>
              )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[450px] p-6 sm:p-8 z-200"
      >
        <div className="text-center">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Create New Folder
          </h4>
          <p className="mb-6 text-sm text-gray-500">
            Enter the academic year to organize incoming documents.
          </p>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <div className="text-left">
              <Label>Academic Year</Label>
              <Input
                type="text"
                placeholder="e.g., 2026-2027"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
