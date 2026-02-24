// // import { useState, useEffect, useCallback } from "react";
// // import ComponentCard from "../../common/ComponentCard";
// // import Label from "../Label";
// // import DropzoneComponent from "./DropZone";
// // import Button from "../../ui/button/Button";
// // import { PaperPlaneIcon } from "../../../icons";
// // import { DocumentService } from "../../../api/services/documentService";
// // import api from "../../../utils/axiousInstance";
// // import ReactSelect from "react-select";
// // import { showAlert } from "../../../utils/toaster";

// // // Define keys for our document types
// // const DOCUMENT_TYPES = ["Form 137", "Form 138", "Birth Certificate", "Good Moral"];

// // interface FileState {
// //   [key: string]: {
// //     file: File | null;
// //     url: string | null; // For existing files from server
// //     id?: string | number;
// //   };
// // }

// // export default function DefaultInputs() {
// //   const [lrn, setStudentLrn] = useState("");
// //   const [yearId, setYearId] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [fetching, setFetching] = useState(false);

// //   // Initialize state for each document type
// //   const [docStates, setDocStates] = useState<FileState>(
// //     DOCUMENT_TYPES.reduce((acc, type) => ({ ...acc, [type]: { file: null, url: null } }), {})
// //   );

// //   const [studentOptions, setStudentOptions] = useState<{ value: string; label: string }[]>([]);
// //   const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([]);

// //   // 1. Initial Load (Options + Recent Uploads)
// //   useEffect(() => {
// //     const fetchInitialData = async () => {
// //       try {
// //         const [resStudents, resYears] = await Promise.all([
// //           api.get("/students"),
// //           api.get("/academic-years"),
// //         ]);
        
// //         const rawStudents = resStudents.data.data || resStudents.data.students || [];
// //         const rawYears = resYears.data.data || resYears.data.years || resYears.data;

// //         setStudentOptions(rawStudents.map((s: any) => ({
// //           value: s.lrn.toString(),
// //           label: `${s.lrn} - ${s.first_name} ${s.last_name}`,
// //         })));

// //         setYearOptions(Array.isArray(rawYears) ? rawYears.map((y: any) => ({
// //           value: y.year_id.toString(),
// //           label: y.academic_year || y.label,
// //         })) : []);
// //       } catch (error) {
// //         showAlert.error("Initialization Error", "Failed to load form options.");
// //       }
// //     };
// //     fetchInitialData();
// //     fetchDocuments(null); // Fetch recent on mount
// //   }, []);

// //   // 2. Fetch Documents based on selection
// //   const fetchDocuments = useCallback(async (selectedLrn: string | null) => {
// //     setFetching(true);
// //     try {
// //       const endpoint = selectedLrn ? `/documents?lrn=${selectedLrn}` : "/documents";
// //       const response = await api.get(endpoint);
// //       const docs = response.data.data || [];

// //       // Create a fresh state mapping
// //       const newState: FileState = DOCUMENT_TYPES.reduce(
// //         (acc, type) => ({ ...acc, [type]: { file: null, url: null } }), 
// //         {}
// //       );

// //       // Map API response to our UI types
// //       docs.forEach((doc: any) => {
// //         if (newState[doc.type]) {
// //           newState[doc.type].url = doc.file_path || doc.url; // Use field from your backend
// //           newState[doc.type].id = doc.id;
// //         }
// //       });

// //       setDocStates(newState);
// //     } catch (error) {
// //       console.error("Fetch Error:", error);
// //     } finally {
// //       setFetching(false);
// //     }
// //   }, []);

// //   // Update when student selection changes
// //   useEffect(() => {
// //     fetchDocuments(lrn || null);
// //   }, [lrn, fetchDocuments]);

// //   const handleFileChange = (type: string, file: File | null) => {
// //     setDocStates((prev) => ({
// //       ...prev,
// //       [type]: { ...prev[type], file: file },
// //     }));
// //   };

// //   const handleRemove = (type: string) => {
// //     setDocStates((prev) => ({
// //       ...prev,
// //       [type]: { file: null, url: null },
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     // Only upload documents that have a new File object
// //     const filesToUpload = Object.entries(docStates).filter(([_, data]) => data.file !== null);

// //     if (!lrn || !yearId || filesToUpload.length === 0) {
// //       showAlert.error("Incomplete", "Please select student, year, and upload at least one new document.");
// //       return;
// //     }

// //     setLoading(true);
// //     showAlert.loading("Uploading documents...");

// //     try {
// //       const uploadPromises = filesToUpload.map(([type, data]) => {
// //         const formData = new FormData();
// //         formData.append("lrn", lrn);
// //         formData.append("year_id", yearId);
// //         formData.append("type", type);
// //         formData.append("attachment", data.file as File);
// //         return DocumentService.upload(formData);
// //       });

// //       await Promise.all(uploadPromises);
// //       showAlert.success("Archived!", "Student documents updated successfully.");
      
// //       // Refresh to show current state from server
// //       fetchDocuments(lrn);
// //       window.dispatchEvent(new Event("documentUploaded"));
// //     } catch (error: any) {
// //       showAlert.error("Upload Error", error.response?.data?.message || "Failed to upload.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // UI Component for File Display
// //   const FilePreview = ({ type }: { type: string }) => {
// //     const data = docStates[type];
// //     const isUploaded = !!data.url;
// //     const isNew = !!data.file;

// //     if (!isUploaded && !isNew) return null;

// //     return (
// //       <div className={`my-1 p-3 border border-dashed rounded-lg flex items-center justify-between 
// //         ${isUploaded ? 'border-green-500 bg-green-500/5' : 'border-blue-500 bg-blue-500/5'}`}>
// //         <div className="flex items-center gap-3">
// //           <div className={isUploaded ? "text-green-500" : "text-blue-500"}>
// //             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               {isUploaded ? (
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
// //               ) : (
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
// //               )}
// //             </svg>
// //           </div>
// //           <div>
// //             <p className="text-sm dark:text-white/90 font-medium">
// //               {isNew ? data.file?.name : `${type} - Existing`}
// //             </p>
// //             {isUploaded && (
// //               <a href={data.url!} target="_blank" className="text-xs text-brand-500 hover:underline">View Document</a>
// //             )}
// //           </div>
// //         </div>
// //         <button onClick={() => handleRemove(type)} className="text-gray-400 hover:text-red-500 transition-colors">
// //           ✕
// //         </button>
// //       </div>
// //     );
// //   };

// //   // Styles (Maintain original)
// //   const selectClassNames = {
// //     control: ({ isFocused }: any) => `!bg-transparent !border-gray-200 dark:!border-gray-800 !rounded-lg !min-h-[44px] !shadow-none ${isFocused ? '!border-brand-500 !ring-3 !ring-brand-500/10' : ''}`,
// //     menu: () => "!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-800 !shadow-lg",
// //     option: ({ isFocused, isSelected }: any) => `${isSelected ? "!bg-brand-500 !text-white" : isFocused ? "!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white" : "!text-gray-700 dark:!text-gray-300"} !cursor-pointer !py-2 !px-3`,
// //     singleValue: () => "!text-gray-800 dark:!text-white/90",
// //     input: () => "!text-gray-800 dark:!text-white/90",
// //     placeholder: () => "!text-gray-400 dark:!text-white/30",
// //   };

// //   return (
// //     <ComponentCard title={lrn ? "Filter: Student Archive" : "Recent Document Uploads"}>
// //       <div className={`space-y-6 ${fetching ? "opacity-60 pointer-events-none" : ""}`}>
// //         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
// //           <div className="space-y-6">
// //             <Label>Student LRN / Name</Label>
// //             <ReactSelect
// //               options={studentOptions}
// //               classNames={selectClassNames}
// //               isClearable
// //               placeholder="Search student..."
// //               onChange={(selected: any) => {
// //                 const selectedLrn = selected?.value || "";
// //                 setStudentLrn(selectedLrn);
// //                 // NEW: Dispatch event to notify the table to filter
// //                 window.dispatchEvent(new CustomEvent("filterRecentUploads", { detail: selectedLrn }));
// //               }}
// //             />
// //           </div>
// //           <div>
// //             <Label>Academic Year</Label>
// //             <ReactSelect
// //               options={yearOptions}
// //               classNames={selectClassNames}
// //               placeholder="Select Year..."
// //               onChange={(selected: any) => setYearId(selected?.value || "")}
// //             />
// //           </div>
// //         {/* </div> */}

// //         {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800"> */}
// //           {DOCUMENT_TYPES.map((type) => (
// //             <div key={type}>
// //               <Label>{type}</Label>
// //               <FilePreview type={type} />
// //               <DropzoneComponent onFileChange={(file) => handleFileChange(type, file)} />
// //             </div>
// //           ))}
// //         {/* </div> */}

// //         <div className="w-full flex justify-end pt-4">
// //           <Button 
// //             onClick={handleSubmit} 
// //             disabled={loading || fetching} 
// //             className="w-full sm:w-auto shadow-lg shadow-brand-500/20"
// //           >
// //             {loading ? "Processing..." : "Submit Archive"}
// //             {!loading && <PaperPlaneIcon className="ml-2" />}
// //           </Button>
// //         </div>
// //       </div>
// //     </ComponentCard>
// //   );
// // }









// import { useState, useEffect, useCallback } from "react";
// import ComponentCard from "../../common/ComponentCard";
// import Label from "../Label";
// import DropzoneComponent from "./DropZone";
// import Button from "../../ui/button/Button";
// import { PaperPlaneIcon } from "../../../icons";
// import { DocumentService } from "../../../api/services/documentService";
// import api from "../../../utils/axiousInstance";
// import ReactSelect from "react-select";
// import { showAlert } from "../../../utils/toaster";

// interface FileState {
//   [key: string]: {
//     file: File | null;
//     url: string | null;
//     id?: string | number;
//   };
// }

// export default function DefaultInputs() {
//   const [lrn, setStudentLrn] = useState("");
//   const [yearId, setYearId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);

//   // 1. Dynamic Document Types State
//   const [documentTypes, setDocumentTypes] = useState<string[]>([]);
//   const [docStates, setDocStates] = useState<FileState>({});

//   const [studentOptions, setStudentOptions] = useState<{ value: string; label: string }[]>([]);
//   const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([]);

//   // 2. Fetch Metadata (Students, Years, AND Document Types)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [resStudents, resYears, resTypes] = await Promise.all([
//           api.get("/students"),
//           api.get("/academic-years"),
//           api.get("/documents/type"), // Dynamic fetch
//         ]);

//         const rawStudents = resStudents.data.data || [];
//         const rawYears = resYears.data.data || [];
//         const rawTypes = resTypes.data.data || []; // The types from your DB

//         // Set the string names for mapping
//         const typeNames = rawTypes.map((t: any) => t.name);
//         setDocumentTypes(typeNames);

//         // Initialize state for each dynamic type
//         const initialDocState: FileState = typeNames.reduce(
//           (acc: any, type: string) => ({ ...acc, [type]: { file: null, url: null } }),
//           {}
//         );
//         setDocStates(initialDocState);

//         setStudentOptions(rawStudents.map((s: any) => ({
//           value: s.lrn.toString(),
//           label: `${s.lrn} - ${s.first_name} ${s.last_name}`,
//         })));

//         setYearOptions(rawYears.map((y: any) => ({
//           value: y.year_id.toString(),
//           label: y.academic_year,
//         })));

//       } catch (error) {
//         showAlert.error("Initialization Error", "Failed to load form options.");
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // 3. Updated Fetch Documents (to handle dynamic types)
//   const fetchDocuments = useCallback(async (selectedLrn: string | null) => {
//     if (documentTypes.length === 0) return; // Wait until types are loaded
    
//     setFetching(true);
//     try {
//       const endpoint = selectedLrn ? `/documents?lrn=${selectedLrn}` : "/documents";
//       const response = await api.get(endpoint);
//       const docs = response.data.data || [];

//       // Reset state based on the dynamic types we found
//       const newState: FileState = documentTypes.reduce(
//         (acc, type) => ({ ...acc, [type]: { file: null, url: null } }),
//         {}
//       );

//       docs.forEach((doc: any) => {
//         if (newState[doc.type]) {
//           newState[doc.type].url = doc.file_path || doc.url;
//           newState[doc.type].id = doc.id;
//         }
//       });

//       setDocStates(newState);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setFetching(false);
//     }
//   }, [documentTypes]);

//   useEffect(() => {
//     fetchDocuments(lrn || null);
//   }, [lrn, fetchDocuments]);

//   // (handleFileChange, handleRemove, and handleSubmit remain largely the same)
//   const handleFileChange = (type: string, file: File | null) => {
//     setDocStates((prev) => ({
//       ...prev,
//       [type]: { ...prev[type], file: file },
//     }));
//   };

//   const handleRemove = (type: string) => {
//     setDocStates((prev) => ({
//       ...prev,
//       [type]: { file: null, url: null },
//     }));
//   };

//   const handleSubmit = async () => {
//     const filesToUpload = Object.entries(docStates).filter(([_, data]) => data.file !== null);

//     if (!lrn || !yearId || filesToUpload.length === 0) {
//       showAlert.error("Incomplete", "Please select student, year, and upload files.");
//       return;
//     }

//     setLoading(true);
//     showAlert.loading("Uploading...");

//     try {
//       const uploadPromises = filesToUpload.map(([type, data]) => {
//         const formData = new FormData();
//         formData.append("lrn", lrn);
//         formData.append("year_id", yearId);
//         formData.append("type", type);
//         formData.append("attachment", data.file as File);
//         return DocumentService.upload(formData);
//       });

//       await Promise.all(uploadPromises);
//       showAlert.success("Archived!", "Documents updated.");
//       fetchDocuments(lrn);
//     } catch (error: any) {
//       showAlert.error("Upload Error", "Failed to upload.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const FilePreview = ({ type }: { type: string }) => {
//     const data = docStates[type];
//     if (!data?.url && !data?.file) return null;
//     const isUploaded = !!data.url;
//     const isNew = !!data.file;

//     return (
//       <div className={`my-1 p-3 border border-dashed rounded-lg flex items-center justify-between 
//         ${isUploaded ? 'border-green-500 bg-green-500/5' : 'border-blue-500 bg-blue-500/5'}`}>
//         <div className="flex items-center gap-3">
//             <p className="text-sm dark:text-white/90 font-medium">
//               {isNew ? data.file?.name : `${type} - Existing`}
//             </p>
//         </div>
//         <button onClick={() => handleRemove(type)} className="text-gray-400 hover:text-red-500">✕</button>
//       </div>
//     );
//   };

//   return (
//     <ComponentCard title={lrn ? "Filter: Student Archive" : "Recent Document Uploads"}>
//       <div className={`space-y-6 ${fetching ? "opacity-60 pointer-events-none" : ""}`}>
        
//         <div>
//           <Label>Student LRN / Name</Label>
//           <ReactSelect
//             options={studentOptions}
//             placeholder="Search student..."
//             onChange={(selected: any) => setStudentLrn(selected?.value || "")}
//           />
//         </div>

//         <div>
//           <Label>Academic Year</Label>
//           <ReactSelect
//             options={yearOptions}
//             placeholder="Select Year..."
//             onChange={(selected: any) => setYearId(selected?.value || "")}
//           />
//         </div>

//         <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
//           {documentTypes.map((type) => (
//             <div key={type} className="p-4 border rounded-xl dark:border-gray-800">
//               <Label className="font-bold text-brand-500">{type}</Label>
//               <FilePreview type={type} />
//               <DropzoneComponent onFileChange={(file) => handleFileChange(type, file)} />
//             </div>
//           ))}
//         </div>

//         <div className="w-full flex justify-end">
//           <Button onClick={handleSubmit} disabled={loading || fetching}>
//             {loading ? "Processing..." : "Submit Archive"}
//             {!loading && <PaperPlaneIcon className="ml-2" />}
//           </Button>
//         </div>
//       </div>
//     </ComponentCard>
//   );
// }









import { useState, useEffect, useCallback } from "react";
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

  // Dynamic Metadata
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [docStates, setDocStates] = useState<FileState>({});
  const [studentOptions, setStudentOptions] = useState<{ value: string; label: string }[]>([]);
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([]);

  // 1. Initial Load: Fetch Options and Dynamic Document Types
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

        const typeNames = rawTypes.map((t: any) => t.name);
        setDocumentTypes(typeNames);

        // Initialize state for dynamic types
        const initialDocState: FileState = typeNames.reduce(
          (acc: any, type: string) => ({ ...acc, [type]: { file: null, url: null } }),
          {}
        );
        setDocStates(initialDocState);

        setStudentOptions(rawStudents.map((s: any) => ({
          value: s.lrn.toString(),
          label: `${s.lrn} - ${s.first_name} ${s.last_name}`,
        })));

        setYearOptions(rawYears.map((y: any) => ({
          value: y.year_id.toString(),
          label: y.academic_year,
        })));
      } catch (error) {
        showAlert.error("Initialization Error", "Failed to load form options.");
      }
    };
    fetchInitialData();
  }, []);

  // 2. Fetch existing documents for the selected student
  const fetchDocuments = useCallback(async (selectedLrn: string | null) => {
    if (documentTypes.length === 0) return;
    
    setFetching(true);
    try {
      const endpoint = selectedLrn ? `/documents?lrn=${selectedLrn}` : "/documents";
      const response = await api.get(endpoint);
      const docs = response.data.data || [];

      const newState: FileState = documentTypes.reduce(
        (acc, type) => ({ ...acc, [type]: { file: null, url: null } }),
        {}
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
  }, [documentTypes]);

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

  // 3. Handle Submit with Duplicate/Error detection
  const handleSubmit = async () => {
    const filesToUpload = Object.entries(docStates).filter(([_, data]) => data.file !== null);

    if (!lrn || !yearId || filesToUpload.length === 0) {
      showAlert.error("Incomplete", "Please select student, year, and upload at least one document.");
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
      
      fetchDocuments(lrn);
      window.dispatchEvent(new Event("documentUploaded"));
    } catch (error: any) {
      // Capture the specific error from backend (e.g., "File already exists")
      const errorMessage = error.response?.data?.message || "Failed to upload some documents.";
      showAlert.error("Upload Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // UI Component for File Display (Restored Original Styling)
  const FilePreview = ({ type }: { type: string }) => {
    const data = docStates[type];
    if (!data?.url && !data?.file) return null;
    const isUploaded = !!data.url;
    const isNew = !!data.file;

    return (
      <div className={`my-2 p-3 border border-dashed rounded-lg flex items-center justify-between 
        ${isUploaded ? 'border-green-500 bg-green-500/5' : 'border-blue-500 bg-blue-500/5'}`}>
        <div className="flex items-center gap-3">
          <div className={isUploaded ? "text-green-500" : "text-blue-500"}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isUploaded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              )}
            </svg>
          </div>
          <div>
            <p className="text-sm dark:text-white/90 font-medium truncate max-w-[200px]">
              {isNew ? data.file?.name : `${type} - Existing Record`}
            </p>
            {isUploaded && (
              <a href={data.url!} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline">View File</a>
            )}
          </div>
        </div>
        <button onClick={() => handleRemove(type)} className="text-gray-400 hover:text-red-500 transition-colors">
          ✕
        </button>
      </div>
    );
  };

  // Original Style Object
  const selectClassNames = {
    control: ({ isFocused }: any) => `!bg-transparent !border-gray-200 dark:!border-gray-800 !rounded-lg !min-h-[44px] !shadow-none ${isFocused ? '!border-brand-500 !ring-3 !ring-brand-500/10' : ''}`,
    menu: () => "!bg-white dark:!bg-gray-900 !border !border-gray-200 dark:!border-gray-800 !shadow-lg",
    option: ({ isFocused, isSelected }: any) => `${isSelected ? "!bg-brand-500 !text-white" : isFocused ? "!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white" : "!text-gray-700 dark:!text-gray-300"} !cursor-pointer !py-2 !px-3`,
    singleValue: () => "!text-gray-800 dark:!text-white/90",
    input: () => "!text-gray-800 dark:!text-white/90",
    placeholder: () => "!text-gray-400 dark:!text-white/30",
  };

  return (
    <ComponentCard title={lrn ? "Archive Management" : "New Archive Entry"}>
      <div className={`space-y-6 ${fetching ? "opacity-60 pointer-events-none" : ""}`}>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Student LRN / Name</Label>
            <ReactSelect
              options={studentOptions}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              classNames={selectClassNames}
              isClearable
              placeholder="Search student..."
              onChange={(selected: any) => {
                const selectedLrn = selected?.value || "";
                setStudentLrn(selectedLrn);
                window.dispatchEvent(new CustomEvent("filterRecentUploads", { detail: selectedLrn }));
              }}
            />
          </div>
          <div>
            <Label>Academic Year</Label>
            <ReactSelect
              options={yearOptions}
              classNames={selectClassNames}
              placeholder="Select Year..."
              onChange={(selected: any) => setYearId(selected?.value || "")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          {documentTypes.map((type) => (
            <div key={type} className="p-4 border rounded-xl dark:border-gray-800">
              <Label className="font-bold text-brand-500">{type}</Label>
              <FilePreview type={type} />
              <DropzoneComponent onFileChange={(file) => handleFileChange(type, file)} />
            </div>
          ))}
        </div>

        <div className="w-full flex justify-end pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={loading || fetching} 
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