import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import API from "../../../api";
import { Document } from "../../../types/models";
import { getVisiblePages } from "../../../utils/paginationHelper";
import { jsPDF } from "jspdf"; // Required: npm install jspdf

interface StudentArchiveTableProps {
  selectedYear: string;
}

export default function StudentArchiveTable({
  selectedYear,
}: StudentArchiveTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // New: Processing state for PDF

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDocs = async () => {
      if (!selectedYear) return;
      try {
        setLoading(true);
        const response = await API.docs.getByYear(selectedYear);
        const data = response.data.data || response.data;
        setDocuments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        setError("Failed to load student documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [selectedYear]);

  // Filter logic
  const filteredData = documents.filter((doc) => {
    const studentName =
      `${doc.student?.first_name} ${doc.student?.last_name}`.toLowerCase();
    const lrn = doc.student?.lrn || "";
    return (
      studentName.includes(searchTerm.toLowerCase()) || lrn.includes(searchTerm)
    );
  });

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // --- FEATURE: DOWNLOAD IMAGE AS PDF ---
  const handleDownloadPDF = (doc: Document) => {
    setIsProcessing(true);
    const imageUrl = `${API_BASE_URL}/${doc.attachment.replace(/\\/g, "/")}`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      // Create PDF (Legal Size 8.5 x 13 inches)
      const pdf = new jsPDF("p", "in", [8.5, 13]);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(img);
      const ratio = imgProps.width / imgProps.height;

      const pdfWidth = pageWidth - 1; // 0.5 inch margins
      const pdfHeight = pdfWidth / ratio;

      pdf.addImage(img, "JPEG", 0.5, 0.5, pdfWidth, pdfHeight);
      pdf.save(`Archive_${doc.student?.last_name}_Form137.pdf`);
      setIsProcessing(false);
    };

    img.onerror = () => {
      alert("Error loading document image.");
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
          <head><title>Print Archive Record</title></head>
          <body style="margin:0; display:flex; justify-content:center; background:#fff;">
            <img src="${imageUrl}" style="max-width:100%;" onload="window.print();window.close();">
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
            />
          </svg>
          Back to Folders
        </button>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search student or LRN..."
            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-3 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] relative">
        {/* Processing Loader */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-gray-700 dark:text-white">
                Processing Document...
              </p>
            </div>
          </div>
        )}

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs uppercase"
                >
                  Student Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs uppercase"
                >
                  Document Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs uppercase"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs uppercase"
                >
                  Date Uploaded
                </TableCell>
                {/* ACTIONS HEADER CENTERED */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs uppercase"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((doc) => (
                  <TableRow
                    key={doc.document_id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                          {doc.student?.last_name?.[0] || "S"}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {doc.student?.first_name} {doc.student?.last_name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs">
                            LRN: {doc.student?.lrn}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
                      {doc.type}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color="success">
                        Verified
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    {/* ACTIONS CELL CENTERED */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* VIEW */}
                        <a
                          href={`${API_BASE_URL}/${doc.attachment.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>

                        {/* DOWNLOAD PDF */}
                        <button
                          onClick={() => handleDownloadPDF(doc)}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Download PDF"
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>

                        {/* PRINT */}
                        <button
                          onClick={() => handlePrint(doc.attachment)}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Print"
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
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-400 text-sm italic"
                  >
                    {error || `No records found for A.Y. ${selectedYear}`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <p className="text-xs text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-700 dark:text-white">
              {currentPage}
            </span>{" "}
            of {totalPages}
          </p>

          <div className="flex items-center gap-1">
            {currentPage > 3 && (
              <button
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600"
              >
                First
              </button>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              {getVisiblePages(totalPages, currentPage).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-blue-600"
              >
                Last
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
