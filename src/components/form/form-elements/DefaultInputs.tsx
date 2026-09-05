import { useState, useEffect, useCallback, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon } from "../../../icons";
import { DocumentService } from "../../../api/services/documentService";
import api from "../../../utils/axiousInstance";
import ReactSelect from "react-select";
import { showAlert } from "../../../utils/toaster";

interface FileState {
  [key: string]: {
    file: File | null;
    url: string | null;
    id?: string | number;
  };
}

export default function DefaultInputs() {
  const [lrn, setStudentLrn] = useState("");
  const [yearId, setYearId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [lockOwner, setLockOwner] = useState<string | null>(null);
  const lockInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [docStates, setDocStates] = useState<FileState>({});
  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resStudents, resYears, resTypes] = await Promise.all([
          api.get("/students"),
          api.get("/academic-years"),
          api.get("/documents/type"),
        ]);

        const rawStudents = resStudents.data.data || [];
        const rawYears = resYears.data.data || [];
        const rawTypes = resTypes.data.data || [];

        const filteredTypes = rawTypes.filter(
          (t: any) => t.isBatchesImported === true,
        );

        const typeNames = filteredTypes.map((t: any) => t.name);
        setDocumentTypes(typeNames);

        // Initialize state for dynamic types
        const initialDocState: FileState = typeNames.reduce(
          (acc: any, type: string) => ({
            ...acc,
            [type]: { file: null, url: null },
          }),
          {},
        );
        setDocStates(initialDocState);

        setStudentOptions(
          rawStudents.map((s: any) => ({
            value: s.lrn.toString(),
            label: `${s.lrn} - ${s.first_name} ${s.last_name}`,
          })),
        );

        setYearOptions(
          rawYears.map((y: any) => ({
            value: y.year_id.toString(),
            label: y.academic_year,
          })),
        );
      } catch (error) {
        showAlert.error("Initialization Error", "Failed to load form options.");
      }
    };
    fetchInitialData();
  }, []);

  const handleLocking = useCallback(async (selectedLrn: string) => {
    try {
      const response = await api.post(`/documents/lock/${selectedLrn}`);
      const { isLocked, isOwner, lockedBy } = response.data;

      if (isLocked && !isOwner) {
        setLockOwner(lockedBy);
        showAlert.error("Record Locked", `${lockedBy} is currently editing this student.`);
      } else {
        setLockOwner(null);
      }
    } catch (error) {
      console.error("Locking Error:", error);
    }
  }, []);

  const releaseLock = async (targetLrn: string) => {
    try {
      await api.delete(`/documents/lock/${targetLrn}`);
    } catch (e) {
      console.error("Release Lock Error");
    }
  };

  useEffect(() => {
    if (lrn) {
      handleLocking(lrn);
      // Heartbeat every 45 seconds to keep the lock alive
      lockInterval.current = setInterval(() => handleLocking(lrn), 45000);
    }
    return () => {
      if (lockInterval.current) clearInterval(lockInterval.current);
      if (lrn) releaseLock(lrn);
    };
  }, [lrn, handleLocking]);

  // Fetch existing documents for the selected student
  const fetchDocuments = useCallback(
    async (selectedLrn: string | null) => {
      if (documentTypes.length === 0) return;

      setFetching(true);
      try {
        const endpoint = selectedLrn
          ? `/documents?lrn=${selectedLrn}`
          : "/documents";
        const response = await api.get(endpoint);
        const docs = response.data.data || [];

        const newState: FileState = documentTypes.reduce(
          (acc, type) => ({ ...acc, [type]: { file: null, url: null } }),
          {},
        );

        docs.forEach((doc: any) => {
          if (newState[doc.type]) {
            newState[doc.type].url = doc.file_path || doc.url;
            newState[doc.type].id = doc.id;
          }
        });

        setDocStates(newState);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setFetching(false);
      }
    },
    [documentTypes],
  );

  useEffect(() => {
    fetchDocuments(lrn || null);
  }, [lrn, fetchDocuments]);

  const handleFileChange = (type: string, file: File | null) => {
    setDocStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], file: file },
    }));
  };

  const handleRemove = (type: string) => {
    setDocStates((prev) => ({
      ...prev,
      [type]: { file: null, url: null },
    }));
  };

  // Handle Submit with Duplicate/Error detection
  const handleSubmit = async () => {
    const filesToUpload = Object.entries(docStates).filter(
      ([_, data]) => data.file !== null,
    );

    if (!lrn || !yearId || filesToUpload.length === 0) {
      showAlert.error(
        "Incomplete",
        "Please select student, year, and upload at least one document.",
      );
      return;
    }

    if (lockOwner) {
      showAlert.error("Submit Denied", "This record is currently locked by another user.");
      return;
    }

    setLoading(true);
    showAlert.loading("Archiving files...");

    try {
      const uploadPromises = filesToUpload.map(([type, data]) => {
        const formData = new FormData();
        formData.append("lrn", lrn);
        formData.append("year_id", yearId);
        formData.append("type", type);
        formData.append("attachment", data.file as File);
        return DocumentService.upload(formData);
      });

      await Promise.all(uploadPromises);
      showAlert.success("Archived!", "Student records updated successfully.");

      // Release lock after success
      releaseLock(lrn);
      
      fetchDocuments(lrn);
      window.dispatchEvent(new Event("documentUploaded"));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload some documents.";
      showAlert.error("Upload Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const FilePreview = ({ type }: { type: string }) => {
    const data = docStates[type];
    if (!data?.url && !data?.file) return null;
    const isUploaded = !!data.url;
    const isNew = !!data.file;

    return (
      <div
        className={`my-2 p-3 border border-dashed rounded-lg flex items-center justify-between 
        ${isUploaded ? "border-green-500 bg-green-500/5" : "border-blue-500 bg-blue-500/5"}`}
      >
        <div className="flex items-center gap-3">
          <div className={isUploaded ? "text-green-500" : "text-blue-500"}>
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isUploaded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              )}
            </svg>
          </div>
          <div>
            <p className="text-sm dark:text-white/90 font-medium truncate max-w-[200px]">
              {isNew ? data.file?.name : `${type} - Existing Record`}
            </p>
            {isUploaded && (
              <a
                href={data.url!}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-500 hover:underline"
              >
                View File
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => handleRemove(type)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>
    );
  };

  const selectClassNames = {
    control: ({ isFocused }: any) =>
      `!bg-transparent !border-gray-200 dark:!border-gray-800 !rounded-lg !min-h-[44px] !shadow-none ${isFocused ? "!border-brand-500 !ring-3 !ring-brand-500/10" : ""}`,
    menu: () =>
      "!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-800 !shadow-lg",
    option: ({ isFocused, isSelected }: any) =>
      `${isSelected ? "!bg-brand-500 !text-white" : isFocused ? "!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white" : "!text-gray-700 dark:!text-gray-300"} !cursor-pointer !py-2 !px-3`,
    singleValue: () => "!text-gray-800 dark:!text-white/90",
    input: () => "!text-gray-800 dark:!text-white/90",
    placeholder: () => "!text-gray-400 dark:!text-white/30",
  };

  const isFormDisabled = fetching || !!lockOwner;

  return (
    <ComponentCard title={lrn ? "Archive Management" : "New Archive Entry"}>
      {lockOwner && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          This student's record is currently being updated by <strong>{lockOwner}</strong>.
        </div>
      )}

      <div className={`space-y-6 ${isFormDisabled ? "opacity-60" : ""}`}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Student LRN / Name</Label>
            <ReactSelect
              options={studentOptions}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              classNames={selectClassNames}
              isClearable
              placeholder="Search student..."
              onChange={(selected: any) => {
                const selectedLrn = selected?.value || "";
                setStudentLrn(selectedLrn);
                window.dispatchEvent(
                  new CustomEvent("filterRecentUploads", {
                    detail: selectedLrn,
                  }),
                );
              }}
            />
          </div>
          <div className={lockOwner ? "pointer-events-none" : ""}>
            <Label>Academic Year</Label>
            <ReactSelect
              options={yearOptions}
              classNames={selectClassNames}
              placeholder="Select Year..."
              onChange={(selected: any) => setYearId(selected?.value || "")}
            />
          </div>
        </div>

        <div className={`flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 ${lockOwner ? "pointer-events-none" : ""}`}>
          {[...documentTypes].sort().map((type) => (
            <div
              key={type}
              className="p-4 border rounded-xl dark:border-gray-800"
            >
              <Label className="font-bold text-brand-500">{type}</Label>
              <FilePreview type={type} />
              <DropzoneComponent
                onFileChange={(file) => handleFileChange(type, file)}
              />
            </div>
          ))}
        </div>

        <div className="w-full flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading || isFormDisabled}
            className="w-full sm:w-auto shadow-lg shadow-brand-500/20"
          >
            {loading ? "Processing..." : "Submit Archive"}
            {!loading && <PaperPlaneIcon className="ml-2" />}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}