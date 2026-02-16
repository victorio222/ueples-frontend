import React, { useState } from "react";
import { useNavigate } from "react-router"; // Added for navigation
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

interface StudentRecord {
  id: number;
  student: {
    image: string;
    name: string;
    lrn: string;
  };
  academicYear: string;
  documentType: string;
  status: string;
  lastUpdated: string;
}

const tableData: StudentRecord[] = [
  {
    id: 1,
    student: { image: "/images/user/user-17.jpg", name: "Lindsey Curtis", lrn: "123456789012" },
    academicYear: "2025-2026",
    documentType: "Form 137-A",
    status: "Verified",
    lastUpdated: "2024-01-15",
  },
  // ... other data
];

interface StudentArchiveTableProps {
  selectedYear?: string;
}

export default function StudentArchiveTable({ selectedYear }: StudentArchiveTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredData = tableData.filter((record) => {
    const matchesYear = selectedYear ? record.academicYear === selectedYear : true;
    const matchesSearch = record.student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.student.lrn.includes(searchTerm);
    return matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Actions: Back Button + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          Back to Folders
        </button>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search student or LRN..."
            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-3 pr-10 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Student Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Document Type</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Last Updated</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    {/* ... Existing TableCells for record data ... */}
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img width={40} height={40} src={record.student.image} alt={record.student.name} />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{record.student.name}</span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">LRN: {record.student.lrn}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{record.documentType}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color={record.status === "Verified" ? "success" : record.status === "Pending" ? "warning" : "error"}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{record.lastUpdated}</TableCell>
                    <TableCell className="px-4 py-3 text-end">
                       <div className="flex items-center justify-end gap-2">
                        <button className="text-gray-500 hover:text-blue-600 transition-colors" title="View Document">
                          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-gray-500 hover:text-green-600 transition-colors" title="Download">
                          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* FIX: Using standard <td> to avoid colSpan error */}
                  <td 
                    colSpan={5} 
                    className="px-5 py-10 text-center text-gray-400 text-sm italic"
                  >
                    No student records found for A.Y. {selectedYear}
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}