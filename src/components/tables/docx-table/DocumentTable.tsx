import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { DocumentService } from "../../../api/services/documentService"; // Adjust path as needed
import { Document } from "../../../types/models";

export default function RecentUploadsTable() {
  const [uploads, setUploads] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Move the fetch logic into a reusable function
  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const response = await DocumentService.getAll(1, 5);
      const docs = response.data.documents || [];
      setUploads(docs);
    } catch (error) {
      console.error("Error loading recent uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 2. Initial load
    fetchRecentFiles();

    // 3. Listen for the custom event
    const handleRefresh = () => {
      fetchRecentFiles();
    };

    window.addEventListener("documentUploaded", handleRefresh);

    // 4. Cleanup listener on unmount
    return () => {
      window.removeEventListener("documentUploaded", handleRefresh);
    };
  }, []);

  // Helper to clean up the filename for display
  const formatFileName = (path: string) => {
    return path.split("\\").pop()?.split("-").pop() || "Unknown File";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">File Name</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Uploaded By</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Academic Year</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date Uploaded</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-gray-400">Loading recent uploads...</TableCell>
              </TableRow>
            ) : uploads.length > 0 ? (
              uploads.map((upload) => (
                <TableRow key={upload.document_id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {formatFileName(upload.attachment)}
                      </span>
                      <span className="block text-gray-500 text-theme-xs">
                        {upload.type}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                        {upload.uploader?.name?.[0] || "U"}
                      </div>
                      <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                        {upload.uploader?.name || "Admin"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                        {upload.academicYear?.label || "---"}
                      </span>
                    {/* <Badge size="sm" color="success">Completed</Badge> */}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
                    {new Date(upload.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-end">
                    <a 
                      href={`http://localhost:5000/${upload.attachment.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <svg className="ml-auto w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-gray-400 italic">No recent uploads found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}