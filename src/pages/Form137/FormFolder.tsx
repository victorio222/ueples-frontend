import React, { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from "../../icons";
import { Modal } from "../../components/ui/modal/index";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useLocation, useNavigate } from "react-router";
import API from "../../api";
import { AcademicYear, Folder, SubFolderItem } from "../../types/models";
import { showAlert } from "../../utils/toaster";
import {
  FilePlusIcon,
  LayoutGrid,
  List,
  FileText,
  FolderIcon,
  ChevronRight,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Download,
  FileCode,
  FileArchive,
  FileAudio,
  FileVideo,
  File,
} from "lucide-react";

export default function FormFolder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [activeItem, setActiveItem] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Data States
  const [folders, setFolders] = useState<AcademicYear[]>([]);
  const [nestedFolders, setNestedFolders] = useState<Folder[]>([]);
  const [currentFiles, setCurrentFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImported, setIsImported] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | number | null>(
    null,
  );

  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type");
  const folderIdParam = queryParams.get("folderId");

  // Get User Role
  const userRole = localStorage.getItem("user_role");

  // Helper to determine File Icon based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    const size = viewMode === "grid" ? 48 : 20;
    const className = "text-gray-500";

    switch (ext) {
      case "pdf":
        return <FileText size={size} className="text-red-500" />;
      case "zip":
      case "rar":
      case "7z":
        return <FileArchive size={size} className="text-orange-500" />;
      case "doc":
      case "docx":
        return <FileText size={size} className="text-blue-600" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileText size={size} className="text-green-600" />;
      case "mp4":
      case "mov":
        return <FileVideo size={size} className="text-purple-500" />;
      case "mp3":
      case "wav":
        return <FileAudio size={size} className="text-pink-500" />;
      case "js":
      case "ts":
      case "tsx":
      case "html":
      case "css":
        return <FileCode size={size} className="text-yellow-600" />;
      default:
        return <File size={size} className={className} />;
    }
  };

  const fetchFolders = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);

      const rootCategory = selectedType.split("/")[0];
      const docRes = await API.docs.getById(rootCategory);
      const docType = docRes.data.data;

      if (!docType) {
        setLoading(false);
        return;
      }

      const isBatchMode = docType.isBatchesImported;
      setIsImported(isBatchMode);

      if (isBatchMode) {
        const yearRes = await API.years.getAll();

        setFolders(yearRes.data.data || []);
        setNestedFolders([]);
        setCurrentFiles([]);
      } else {
        let subfolders: Folder[] = [];
        let files: SubFolderItem[] = [];

        if (folderIdParam) {
          const [subRes, filesRes] = await Promise.all([
            API.docs.getSubFolders(folderIdParam),
            API.docs
              .getFilesByFolder(folderIdParam)
              .catch(() => null),
          ]);

          subfolders = subRes.data.data || [];
          files = filesRes?.data.data || [];
        } else {
          const treeRes = await API.docs.getFolderTree(
            docType.doctype_id
          );

          subfolders = treeRes.data.data || [];
        }

        setNestedFolders(subfolders);
        setCurrentFiles(files);
        setFolders([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const fetchFolders = async () => {
  //   if (!selectedType) return;
  //   try {
  //     setLoading(true);
  //     const rootCategory = selectedType.split("/")[0];
  //     const docRes = await API.docs.getById(rootCategory);
  //     const docType = docRes.data.data;
  //     if (!docType) {
  //       setLoading(false);
  //       return;
  //     }

  //     const isBatchMode = docType.isBatchesImported;
  //     setIsImported(isBatchMode);

  //     if (isBatchMode) {
  //       const yearRes = await API.years.getAll();
  //       setFolders(yearRes.data.data || []);
  //       setNestedFolders([]);
  //       setCurrentFiles([]);
  //       // } else {
  //       //   let subfolders = [];
  //       //   let files = [];

  //       let subfolders: Folder[] = [];
  //       let files: SubFolderItem[] = [];
  //       if (folderIdParam) {
  //         const [subRes, filesRes] = await Promise.all([
  //           API.docs.getSubFolders(folderIdParam),
  //           API.docs
  //             .getFilesByFolder(folderIdParam)
  //             .catch(() => ({ data: { data: [] } })),
  //         ]);
  //         subfolders = subRes.data?.data || subRes.data || [];
  //         files = filesRes.data?.data || filesRes.data || [];
  //       } else {
  //         const treeRes = await API.docs.getFolderTree(docType.doctype_id);
  //         subfolders = Array.isArray(treeRes.data)
  //           ? treeRes.data
  //           : treeRes.data?.data || [];
  //       }
  //       setNestedFolders(subfolders);
  //       setCurrentFiles(files);
  //       setFolders([]);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchFolders();
  }, [selectedType, folderIdParam]);

  const explorerItems = useMemo(() => {
    // 1. Process Folders (Batches or Nested Folders)
    const folderItems = isImported
      ? folders.map((f) => ({
        ...f,
        id: `batch-${f.academic_year}`,
        isFolder: true,
        explorerName: `Batch ${f.academic_year}`,
        explorerType: "batch",
      }))
      : nestedFolders.map((f) => ({
        ...f,
        id: f.folder_id,
        isFolder: true,
        explorerName: f.name,
        explorerType: "folder",
      }));

    // 2. Process Files
    const fileItems = currentFiles.map((f) => ({
      ...f,
      id: f.file_id,
      isFolder: false,
      explorerName: f.name || f.original_name,
      explorerType: "file",
    }));

    // 3. Combine, Filter by Search, and Sort
    return [...folderItems, ...fileItems]
      .filter((item) =>
        item.explorerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        // If both items are batches, sort by academic year DESCENDING (Latest first)
        if (a.explorerType === "batch" && b.explorerType === "batch") {
          return b.explorerName.localeCompare(a.explorerName);
        }

        // Default: Sort everything else alphabetically ASCENDING
        return a.explorerName.localeCompare(b.explorerName);
      });
  }, [folders, nestedFolders, currentFiles, searchTerm, isImported]);

  const handleItemClick = (item: any) => {
    if (item.isFolder) {
      if (item.explorerType === "batch") {
        navigate(
          `/archive/${item.academic_year}?type=${encodeURIComponent(selectedType!)}`,
        );
      } else {
        const newPath = `${selectedType}/${item.explorerName}`;
        navigate(
          `/documents?type=${encodeURIComponent(newPath)}&folderId=${item.folder_id}`,
        );
      }
    } else {
      handleView(item);
    }
  };

  const handleView = (item: any) =>
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/${item.file_attachment}`,
      "_blank",
    );

  const handleDownload = (item: any) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_API_BASE_URL}/${item.file_attachment}`;
    link.download = item.explorerName;
    link.click();
  };

  const handleDelete = async (item: any) => {
    const result = await showAlert.confirm(
      "Delete Item?",
      `This will permanently remove ${item.explorerName}.`,
    );
    if (!result.isConfirmed) return;
    try {
      showAlert.loading("Processing...");
      if (item.isFolder) await API.docs.deleteFolder(item.folder_id);
      else await API.docs.delete(item.file_id);
      showAlert.success("Deleted", "Item removed successfully.");
      fetchFolders();
    } catch (err) {
      showAlert.error("Error", "Could not delete item.");
    }
  };

  const onRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameValue.trim()) {
      showAlert.error("Validation Error", "Name cannot be empty.");
      return;
    }
    try {
      showAlert.loading("Renaming...");
      if (activeItem.isFolder) {
        await API.docs.renameFolder(activeItem.folder_id, {
          name: renameValue,
        });
      } else {
        await API.docs.renameFile(activeItem.file_id, {
          name: renameValue,
        });
      }
      setIsRenameModalOpen(false);
      showAlert.success("Success", "Renamed successfully.");
      fetchFolders();
    } catch (err) {
      console.error(err);
      showAlert.error("Error", "Failed to rename.");
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    showAlert.loading("Creating folder...");
    try {
      const rootCategory = selectedType!.split("/")[0];
      const docRes = await API.docs.getById(rootCategory);

      const docType = docRes.data.data;

      if (!docType) {
        showAlert.error("Error", "Document type not found.");
        return;
      }

      if (isImported) {
        await API.years.create(newYear);
      } else {
        await (folderIdParam
          ? API.docs.createSubFolder({
            name: newYear,
            doctype_id: docType.doctype_id,
            parent_folder_id: Number(folderIdParam),
          })
          : API.docs.creatRootFolder({
            name: newYear,
            doctype_id: docType.doctype_id,
            parent_folder_id: null,
          }));
      }
      showAlert.success("Success!", "Folder created.");
      setNewYear("");
      setIsModalOpen(false);
      fetchFolders();
    } catch (err) {
      showAlert.error("Error", "Failed to create.");
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", fileName);
    formData.append("folder_id", folderIdParam!);
    formData.append("file_attachment", selectedFile!);
    showAlert.loading("Uploading...");
    try {
      await API.docs.uploadToFolder(formData);
      showAlert.success("Uploaded!", "File saved.");
      setFileName("");
      setSelectedFile(null);
      setIsFileModalOpen(false);
      fetchFolders();
    } catch (err) {
      showAlert.error("Error", "Upload failed.");
    }
  };

  const ActionPopover = ({ item }: { item: any }) => {
    if (openPopoverId !== item.id) return null;

    // Logic: If it's a batch folder (isImported), we don't show any actions.
    if (item.explorerType === "batch") return null;

    return (
      <>
        <div
          className="fixed inset-0 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setOpenPopoverId(null);
          }}
        ></div>
        <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 py-2 overflow-hidden animate-in fade-in zoom-in duration-100">
          {!item.isFolder && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item);
                  setOpenPopoverId(null);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Download size={16} className="text-blue-500" /> Download
              </button>
              <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1"></div>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveItem(item);
              setRenameValue(item.explorerName);
              setIsRenameModalOpen(true);
              setOpenPopoverId(null);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <Pencil size={16} className="text-blue-500" /> Rename
          </button>

          {/* Restriction for Interns: Hide delete button */}
          {userRole !== "Intern" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
                setOpenPopoverId(null);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <PageMeta title="File Manager" description="file management" />
      <PageBreadcrumb pageTitle="Explorer" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <span className="text-sm font-semibold block lg:hidden sm:block">Back</span>
            </div>
            <div className="hidden items-center text-sm font-medium text-gray-400 lg:flex md:hidden">
              {selectedType?.split("/").map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span
                    className={
                      i === arr.length - 1
                        ? "text-gray-800 dark:text-white font-bold"
                        : ""
                    }
                  >
                    {part}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronRight size={14} className="mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-64 rounded-lg border border-gray-200 bg-transparent py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:text-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600" : "text-gray-500"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Global Toolbar hidden for Staff and hidden in Import/Batch mode */}
        {!isImported && userRole !== "Staff" && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 hover:-translate-y-0.5"
            >
              <PlusIcon /> New Folder
            </button>
            <button
              onClick={() =>
                folderIdParam
                  ? setIsFileModalOpen(true)
                  : showAlert.error(
                    "Selection Needed",
                    "Selection a folder to upload files.",
                  )
              }
              className="text-sm bg-green-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-500/10 active:scale-95 hover:-translate-y-0.5"
            >
              <FilePlusIcon size={17} /> New File
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-md"></div>
            <p className="text-gray-400 text-sm animate-pulse">
              Fetching records...
            </p>
          </div>
        ) : explorerItems.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-gray-50 dark:bg-white/[0.02] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderIcon size={40} className="text-gray-200" />
            </div>
            <h3 className="text-gray-800 dark:text-white font-medium">
              No items found
            </h3>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {explorerItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/20 dark:border-gray-800 dark:bg-white/[0.01] dark:hover:border-blue-500/30 shadow-sm hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer transition-transform group-hover:scale-105 duration-200"
                  >
                    {item.isFolder ? (
                      <FolderIcon
                        size={54}
                        className="text-blue-500 fill-blue-500/10"
                      />
                    ) : (
                      <div className="relative">
                        {getFileIcon(item.file_attachment || item.explorerName)}
                        <span className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-md px-1.5 py-0.5 text-[9px] font-bold border border-gray-200 dark:border-gray-700 uppercase shadow-sm">
                          {item.file_attachment?.split(".").pop() || "file"}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Only show popover if it's NOT a batch folder */}
                  {item.explorerType !== "batch" && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId(
                            openPopoverId === item.id ? null : item.id,
                          );
                        }}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      <ActionPopover item={item} />
                    </div>
                  )}
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <h4
                    className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-full"
                    title={item.explorerName}
                  >
                    {item.explorerName}
                  </h4>
                  <p className="mt-1 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {item.isFolder ? "Folder" : "Document"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-500 tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-500 tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {explorerItems.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <td
                      className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.isFolder ? (
                        <FolderIcon size={20} className="text-blue-500" />
                      ) : (
                        getFileIcon(item.file_attachment)
                      )}
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {item.explorerName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      {item.explorerType !== "batch" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPopoverId(
                                openPopoverId === item.id ? null : item.id,
                              );
                            }}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          <ActionPopover item={item} />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        className="max-w-[420px] p-8 z-[200]"
      >
        <h4 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">
          Rename
        </h4>
        <form onSubmit={onRenameSubmit} className="space-y-5">
          <div>
            <Label>Name</Label>
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsRenameModalOpen(false)}
              className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[450px] p-8 z-[200]"
      >
        <h4 className="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-white">
          {folderIdParam ? "New Sub-folder" : "New Folder"}
        </h4>
        <form onSubmit={handleCreateFolder} className="space-y-5">
          <div>
            <Label>Folder Name</Label>
            <Input
              type="text"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="e.g. 2nd Semester 2024"
              required
              className="mt-1"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 text-white py-3 text-sm font-bold"
            >
              Create Folder
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        className="max-w-[450px] p-8 z-[200]"
      >
        <h4 className="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Upload New Item
        </h4>
        <form onSubmit={handleUploadFile} className="space-y-5">
          <div>
            <Label>Display Name</Label>
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File title..."
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Select File</Label>
            <div className="mt-2 flex justify-center px-6 pt-8 pb-10 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50/30">
              <label className="space-y-2 text-center cursor-pointer w-full">
                <FileText className="mx-auto h-14 w-14 text-gray-300" />
                <div className="text-sm text-blue-600 font-bold">
                  {selectedFile ? selectedFile.name : "Browse Files"}
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    required
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsFileModalOpen(false)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-green-600 text-white py-3 text-sm font-bold"
            >
              Start Upload
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
