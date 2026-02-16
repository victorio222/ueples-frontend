import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

interface RecentUpload {
  id: number;
  file: {
    name: string;
    type: string; // e.g., PDF, DOCX
    size: string;
  };
  uploadedBy: {
    image: string;
    name: string;
  };
  dateUploaded: string;
  status: string; // "Completed", "Processing", "Failed"
}

const recentUploadData: RecentUpload[] = [
  {
    id: 1,
    file: { name: "Transcript_Record_Curtis.pdf", type: "PDF", size: "1.2 MB" },
    uploadedBy: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
    },
    dateUploaded: "Oct 24, 2023",
    status: "Completed",
  },
  {
    id: 2,
    file: { name: "Enrollment_Form_Kaiya.pdf", type: "PDF", size: "850 KB" },
    uploadedBy: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
    },
    dateUploaded: "Oct 23, 2023",
    status: "Processing",
  },
  {
    id: 3,
    file: { name: "ID_Photo_Zain.jpg", type: "JPG", size: "2.4 MB" },
    uploadedBy: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
    },
    dateUploaded: "Oct 22, 2023",
    status: "Completed",
  },
];

export default function RecentUploadsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                File Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Uploaded By
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Date
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {recentUploadData.map((upload) => (
              <TableRow key={upload.id}>
                {/* File Info */}
                <TableCell className="px-5 py-4 text-start">
                  <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {upload.file.name}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {upload.file.type} • {upload.file.size}
                    </span>
                  </div>
                </TableCell>

                {/* User Info */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 overflow-hidden rounded-full">
                      <img src={upload.uploadedBy.image} alt={upload.uploadedBy.name} />
                    </div>
                    <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                      {upload.uploadedBy.name}
                    </span>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                  {upload.dateUploaded}
                </TableCell>

                {/* Status */}
                <TableCell className="px-5 py-4 text-start">
                  <Badge
                    size="sm"
                    color={
                      upload.status === "Completed"
                        ? "success"
                        : upload.status === "Processing"
                        ? "warning"
                        : "error"
                    }
                  >
                    {upload.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}