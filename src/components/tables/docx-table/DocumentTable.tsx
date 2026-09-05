import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DocumentService } from "../../../api/services/documentService";
import { Document } from "../../../types/models";
import { getVisiblePages } from "../../../utils/paginationHelper";
import { jsPDF } from "jspdf";

export default function RecentUploadsTable() {
  const [uploads, setUploads] = useState<Document[]>([]);
  const [selectedLrn, setSelectedLrn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_, setTotalItems] = useState(0);
  const pageSize = 10;

  const API_BASE_URL = import.meta.env.API_BASE_URL;

  const fetchRecentFiles = useCallback(async (page: number, lrnFilter: string | null) => {
    try {
      setLoading(true);
      const response = await DocumentService.getAll(page, pageSize, lrnFilter); 
      
      const { documents, totalPages, totalItems } = response.data.data;
      setUploads(documents || []);
      setTotalPages(totalPages || 1);
      setTotalItems(totalItems);
    } catch (error) {
      console.error("Error loading recent uploads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentFiles(currentPage, selectedLrn);

    const handleFilter = (e: any) => {
      const lrn = e.detail || null;
      setSelectedLrn(lrn);
      setCurrentPage(1);
    };

    const handleRefresh = () => {
      setCurrentPage(1);
      fetchRecentFiles(1, selectedLrn);
    };

    window.addEventListener("filterRecentUploads", handleFilter);
    window.addEventListener("documentUploaded", handleRefresh);
    
    return () => {
      window.removeEventListener("filterRecentUploads", handleFilter);
      window.removeEventListener("documentUploaded", handleRefresh);
    };
  }, [currentPage, selectedLrn, fetchRecentFiles]);

  const formatFileName = (path: string) => {
    return path.split("\\").pop()?.split("-").pop() || "Unknown File";
  };

  // --- FEATURE: DOWNLOAD IMAGE AS PDF ---
  const handleDownloadPDF = (upload: Document) => {
    setIsProcessing(true);
    const imageUrl = `${API_BASE_URL}/${upload.attachment.replace(/\\/g, "/")}`;
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = imageUrl;

    img.onload = () => {
      const pdf = new jsPDF("p", "in", [8.5, 13]);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(img);
      const ratio = imgProps.width / imgProps.height;
      const pdfWidth = pageWidth - 1; 
      const pdfHeight = pdfWidth / ratio;

      pdf.addImage(img, "JPEG", 0.5, 0.5, pdfWidth, pdfHeight);
      pdf.save(`${upload.type}_${upload.student.last_name}.pdf`);
      setIsProcessing(false);
    };

    img.onerror = () => {
      alert("Failed to load image for PDF conversion.");
      setIsProcessing(false);
    };
  };

  // --- FEATURE: PRINT IMAGE ---
  const handlePrint = (path: string) => {
    const imageUrl = `${API_BASE_URL}/${path.replace(/\\/g, "/")}`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Document</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#f0f0f0;">
            <img src="${imageUrl}" style="max-width:100%; box-shadow: 0 0 10px rgba(0,0,0,0.2);" onload="window.print();window.close();">
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          {selectedLrn ? `Archive for LRN: ${selectedLrn}` : "Recent Document Uploads"}
        </h3>
        {selectedLrn && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full dark:bg-blue-500/10">
            Filter Active
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-gray-700 dark:text-white">Generating PDF...</p>
            </div>
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Student</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Document Type</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Academic Year</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Uploaded By</TableCell>
                <TableCell isHeader className="text-center px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-gray-400">Loading records...</TableCell>
                </TableRow>
              ) : uploads.length > 0 ? (
                uploads.map((upload) => (
                  <TableRow key={upload.document_id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {upload.student.first_name} {upload.student.last_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs">LRN: {upload.student.lrn}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block text-gray-700 text-theme-sm dark:text-gray-300">{upload.type}</span>
                      <span className="block text-gray-400 text-theme-xs truncate max-w-[150px]">{formatFileName(upload.attachment)}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-400">{upload.academicYear?.label}</TableCell>
                    <TableCell className="px-5 py-4 text-gray-600 text-theme-sm dark:text-gray-400">{upload.uploader?.name}</TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <a href={`${API_BASE_URL}/${upload.attachment.replace(/\\/g, "/")}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-white/5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></a>
                        <button onClick={() => handleDownloadPDF(upload)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-white/5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></button>
                        <button onClick={() => handlePrint(upload.attachment)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600 dark:hover:bg-white/5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-gray-400">No documents found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <p className="text-xs text-gray-500">Page <span className="font-medium text-gray-700 dark:text-white">{currentPage}</span> of {totalPages}</p>
          <div className="flex items-center gap-1">
            {currentPage > 3 && <button onClick={() => setCurrentPage(1)} className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600">First</button>}
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <div className="flex items-center gap-1">
              {getVisiblePages(totalPages, currentPage).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
            {currentPage < totalPages - 2 && <button onClick={() => setCurrentPage(totalPages)} className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600">Last</button>}
          </div>
        </div>
      </div>
    </div>
  );
}