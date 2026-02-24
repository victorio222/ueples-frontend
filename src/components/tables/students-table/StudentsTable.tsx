// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
// import Badge from "../../ui/badge/Badge";
// import { 
//   Eye, 
//   UserPlus, 
//   ArrowRightLeft, 
//   Search,
//   Filter,
//   LogOut,
//   CheckCircle2,
//   X,
//   User,
//   Calendar,
//   Hash,
//   School
// } from "lucide-react";

// // --- Types ---
// interface Student {
//   id: number;
//   lrn: string;
//   first_name: string;
//   last_name: string;
//   grade: number;
//   section: string;
//   status: string;
//   year: string;
// }

// const MOCK_STUDENTS: Student[] = [
//   { id: 1, lrn: "102938475", first_name: "Juan", last_name: "Dela Cruz", grade: 1, section: "A", status: "Active", year: "2025-2026" },
//   { id: 2, lrn: "102938476", first_name: "Maria", last_name: "Santos", grade: 1, section: "B", status: "Active", year: "2025-2026" },
//   { id: 3, lrn: "102938477", first_name: "Ricardo", last_name: "Ramos", grade: 2, section: "A", status: "Active", year: "2024-2025" },
// ];

// const ACADEMIC_YEARS = ["2026-2027", "2025-2026", "2024-2025", "2023-2024"];

// // --- 1. Toast Notification Component ---
// const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return ReactDOM.createPortal(
//     <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 fade-in duration-300">
//       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
//         <CheckCircle2 className="text-green-400" size={16} />
//       </div>
//       <span className="text-sm font-medium tracking-tight">{message}</span>
//       <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-md transition-colors">
//         <X size={14} className="text-gray-400" />
//       </button>
//     </div>,
//     document.body
//   );
// };

// // --- 2. View Profile Modal ---
// const ViewProfileModal = ({ student, onClose }: { student: Student, onClose: () => void }) => {
//   return ReactDOM.createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
//       {/* Modal Content */}
//       <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-6">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
//                 {student.last_name[0]}
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Profile</h3>
//                 <p className="text-sm text-gray-500 font-mono">ID: {student.id}</p>
//               </div>
//             </div>
//             <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
//               <X size={20} className="text-gray-400" />
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
//               <User size={18} className="text-blue-500" />
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-gray-400">Full Name</p>
//                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{student.first_name} {student.last_name}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
//               <Hash size={18} className="text-purple-500" />
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-gray-400">LRN Number</p>
//                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{student.lrn}</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
//                 <School size={18} className="text-emerald-500" />
//                 <div>
//                   <p className="text-[10px] uppercase font-bold text-gray-400">Grade & Section</p>
//                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{student.grade}-{student.section}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
//                 <Calendar size={18} className="text-orange-500" />
//                 <div>
//                   <p className="text-[10px] uppercase font-bold text-gray-400">Academic Year</p>
//                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{student.year}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button 
//             onClick={onClose}
//             className="w-full mt-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm transition-transform active:scale-95"
//           >
//             Close Profile
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// // --- Main Page Component ---
// export default function StudentManagement() {
//   const [students, setStudents] = useState(MOCK_STUDENTS);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("2025-2026");
  
//   // States
//   const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
//   const [toastMessage, setToastMessage] = useState<string | null>(null);

//   const handlePromote = (id: number) => {
//     const student = students.find(s => s.id === id);
//     if (student) {
//       setStudents(prev => prev.map(s => s.id === id ? { ...s, grade: s.grade + 1 } : s));
//       setToastMessage(`${student.first_name} has been promoted to Grade ${student.grade + 1}!`);
//     }
//   };

//   const handleTransfer = (id: number) => {
//     const student = students.find(s => s.id === id);
//     if (student) {
//       setToastMessage(`${student.first_name} is marked for transfer.`);
//     }
//   };

//   const filteredData = students.filter((s) => {
//     const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
//     const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.lrn.includes(searchTerm);
//     const matchesGrade = selectedGrade === "All" || s.grade.toString() === selectedGrade;
//     const matchesYear = selectedYear === "All" || s.year === selectedYear;
//     return matchesSearch && matchesGrade && matchesYear;
//   });

//   return (
//     <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Student Management</h2>
//           <p className="text-sm text-gray-500">Academic Year: {selectedYear}</p>
//         </div>
//         <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all">
//           <UserPlus size={18} /> Register Student
//         </button>
//       </div>

//       {/* Filter Bar */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl shadow-sm">
//         <div className="space-y-1.5 lg:col-span-2">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Profiles</label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//                type="text" 
//                placeholder="Search by name, LRN, or section..." 
//                className="w-full h-10 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
//                value={searchTerm} 
//                onChange={(e) => setSearchTerm(e.target.value)} 
//             />
//           </div>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grade Level</label>
//           <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-3 text-sm outline-none focus:border-blue-500 transition-all">
//             <option value="All">All Grades</option>
//             {[1,2,3,4,5,6].map(g => <option key={g} value={g}>Grade {g}</option>)}
//           </select>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academic Year</label>
//           <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 px-3 text-sm outline-none focus:border-blue-500 transition-all">
//             {ACADEMIC_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
//         <div className="max-w-full overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-gray-50/50 dark:bg-white/[0.02]">
//               <TableRow>
//                 <TableCell isHeader className="px-5 py-4 text-theme-xs uppercase font-bold text-gray-400">Student Profile</TableCell>
//                 <TableCell isHeader className="px-5 py-4 text-theme-xs uppercase font-bold text-gray-400">Classification</TableCell>
//                 <TableCell isHeader className="px-5 py-4 text-theme-xs uppercase font-bold text-gray-400">Status</TableCell>
//                 <TableCell isHeader className="px-5 py-4 text-center text-theme-xs uppercase font-bold text-gray-400">Actions</TableCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {filteredData.map((student) => (
//                 <TableRow key={student.id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors group">
//                   <TableCell className="px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shadow-sm transition-transform group-hover:scale-105 duration-200">
//                         {student.last_name[0]}
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-gray-800 text-sm dark:text-white/90">{student.first_name} {student.last_name}</span>
//                         <span className="text-gray-400 text-[11px] font-mono">LRN {student.lrn}</span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4">
//                     <div className="flex flex-col">
//                       <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Grade {student.grade} - {student.section}</span>
//                       <span className="text-gray-400 text-xs">{student.year}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4">
//                     <Badge size="sm" color="success" className="px-3 rounded-full text-[10px] font-bold">ACTIVE</Badge>
//                   </TableCell>
                  
//                   {/* DIRECT ACTIONS - NO DROPDOWN */}
//                   <TableCell className="px-5 py-4">
//                     <div className="flex items-center justify-center gap-1.5">
//                       <button 
//                         onClick={() => setViewingStudent(student)}
//                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
//                         title="View Profile"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handlePromote(student.id)}
//                         className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
//                         title="Promote"
//                       >
//                         <ArrowRightLeft size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleTransfer(student.id)}
//                         className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-all"
//                         title="Transfer Out"
//                       >
//                         <LogOut size={18} />
//                       </button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Overlays */}
//       {viewingStudent && (
//         <ViewProfileModal 
//           student={viewingStudent} 
//           onClose={() => setViewingStudent(null)} 
//         />
//       )}

//       {toastMessage && (
//         <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
//       )}
//     </div>
//   );
// }














import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { 
  Eye, 
  UserPlus, 
  ArrowRightLeft, 
  Search,
  LogOut,
  CheckCircle2,
  X,
  User,
  Calendar,
  Hash,
  School
} from "lucide-react";

const MySwal = withReactContent(Swal);

// --- Types ---
interface Student {
  id: number;
  lrn: string;
  first_name: string;
  last_name: string;
  grade: number;
  section: string;
  status: string;
  year: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: 1, lrn: "102938475", first_name: "Juan", last_name: "Dela Cruz", grade: 1, section: "A", status: "Active", year: "2025-2026" },
  { id: 2, lrn: "102938476", first_name: "Maria", last_name: "Santos", grade: 1, section: "B", status: "Active", year: "2025-2026" },
  { id: 3, lrn: "102938477", first_name: "Ricardo", last_name: "Ramos", grade: 2, section: "A", status: "Active", year: "2024-2025" },
];

const ACADEMIC_YEARS = ["2026-2027", "2025-2026", "2024-2025", "2023-2024"];

// --- 1. Toast Notification Component ---
const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20">
        <CheckCircle2 className="text-green-400" size={16} />
      </div>
      <span className="text-sm font-medium tracking-tight">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-md transition-colors">
        <X size={14} className="text-gray-400" />
      </button>
    </div>,
    document.body
  );
};

// --- 2. View Profile Modal ---
const ViewProfileModal = ({ student, onClose }: { student: Student, onClose: () => void }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {student.last_name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Profile</h3>
                <p className="text-sm text-gray-500 font-mono">ID: {student.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
              <User size={18} className="text-blue-500" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Full Name</p>
                <p className="text-sm font-semibold">{student.first_name} {student.last_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <School size={18} className="text-emerald-500" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Level</p>
                  <p className="text-sm font-semibold">Grade {student.grade}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <Hash size={18} className="text-purple-500" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Section</p>
                  <p className="text-sm font-semibold">{student.section}</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full mt-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm">
            Close Profile
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default function StudentManagement() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- SweetAlert Confirmations ---
  
  const confirmPromote = (student: Student) => {
    MySwal.fire({
      title: "Promote Student?",
      text: `Moving ${student.first_name} to Grade ${student.grade + 1}. This action is permanent.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // blue-600
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, promote!",
      customClass: {
        popup: 'rounded-3xl border-none',
        confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, grade: s.grade + 1 } : s));
        setToastMessage(`${student.first_name} promoted to Grade ${student.grade + 1}!`);
      }
    });
  };

  const confirmTransfer = (student: Student) => {
    MySwal.fire({
      title: "Confirm Transfer?",
      text: `Are you sure you want to mark ${student.first_name} for transfer?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c", // orange-600
      cancelButtonColor: "#64748b",
      confirmButtonText: "Transfer Out",
      customClass: {
        popup: 'rounded-3xl border-none',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setToastMessage(`${student.first_name} has been transferred successfully.`);
      }
    });
  };

  const filteredData = students.filter((s) => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.lrn.includes(searchTerm);
    const matchesGrade = selectedGrade === "All" || s.grade.toString() === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Student Management</h2>
          <p className="text-sm text-gray-500">Manage student records and academic progress</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all">
          <UserPlus size={18} /> Register Student
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by LRN or name..." 
            className="w-full h-11 bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={selectedGrade} 
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="h-11 px-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none text-sm font-medium"
        >
          <option value="All">All Grades</option>
          {[1,2,3,4,5,6].map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</TableCell>
                <TableCell isHeader className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Classification</TableCell>
                <TableCell isHeader className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredData.map((student) => (
                <TableRow key={student.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600">
                        {student.last_name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{student.first_name} {student.last_name}</span>
                        <span className="text-gray-400 text-[11px] font-mono tracking-tighter">LRN {student.lrn}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grade {student.grade} - {student.section}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => setViewingStudent(student)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => confirmPromote(student)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                        title="Promote"
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                      <button 
                        onClick={() => confirmTransfer(student)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"
                        title="Transfer"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Overlays */}
      {viewingStudent && (
        <ViewProfileModal 
          student={viewingStudent} 
          onClose={() => setViewingStudent(null)} 
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}