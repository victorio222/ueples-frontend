import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DropzoneComponent from "../../components/form/form-elements/ImportData";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import API from "../../api"; 
import { toast } from "react-hot-toast";
import { showAlert } from "../../utils/toaster"; // Ensure this import matches your project structure

export default function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please upload an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);

    setLoading(true);
    
    // 1. Show SweetAlert Loading state
    showAlert.loading("Uploading and processing records. Please wait...");

    try {
      const response = await API.students.bulkImport(formData);

      if (response.status === 201 || response.status === 200) {
        // 2. Show SweetAlert Success
        await showAlert.success(
          "Import Successful",
          response.data.message || "Student records have been successfully added to the system."
        );
        
        setFile(null);
      }
    } catch (error: any) {
      console.error("Import Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload and process file.";
      
      // 3. Show SweetAlert Error
      showAlert.error("Import Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Import"
        description="Import data for the student records."
      />
      <PageBreadcrumb pageTitle="Import Data" />
      
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90 text-2xl">
            Upload Student Records
          </h3>
          <p className="text-sm text-gray-500 mb-8">
            The system will automatically process the file and validate student LRNs.
          </p>
        </div>

        <div className="max-w-[630px] mx-auto">
          <Label>Select Excel File (.xlsx, .xls)</Label>
          <DropzoneComponent onFileChange={handleFileChange} />
          
          {file && (
            <div className="mt-4 p-4 border border-dashed border-blue-500 rounded-lg bg-blue-500/5 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium dark:text-white/90">{file.name}</p>
                    <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button 
                disabled={!file || loading} 
                onClick={handleImport}
                className={`${loading ? 'opacity-70 cursor-not-allowed' : ''} shadow-lg shadow-blue-500/20`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                </span>
              ) : "Upload & Import"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}