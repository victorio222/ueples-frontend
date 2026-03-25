// Common fields for all models that use timestamps
interface BaseEntity {
  created_at?: string; // Sequelize timestamps are returned as ISO strings
  updated_at?: string;
  createdAt?: string;  // Depending on your Sequelize config
  updatedAt?: string;
}

export type Gender = 'Male' | 'Female';
export type UserStatus = 'Active' | 'Inactive';

export interface AcademicYear extends BaseEntity {
  year_id: number;
  academic_year: string; // e.g., "2025-2026"
  label: string
}

export interface UserRole extends BaseEntity {
  role_id: number;
  role_name: string;
}

export interface User extends BaseEntity {
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  suffix_name?: string | null;
  email: string;
  phone_number?: string | null;
  user_image?: string | null;
  gender?: Gender | null;
  status: UserStatus;
  role_id: number;
  role: UserRole
  name?: string
  // password is usually omitted from frontend types for security
}

export interface Student extends BaseEntity {
  student_id: number;
  lrn: string; // 12-digit numeric string
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  extension_name?: string | null;
  email?: string | null;
  profile_image?: string | null;
  date_of_birth?: string | null; // ISO Date string
  gender: Gender;
  fullName?: string; // From your getterMethods
}

export interface Document extends BaseEntity {
  document_id: number;
  student_id: number;
  posted_by: number; // Links to User.user_id
  year_id: number;   // Links to AcademicYear.year_id
  type: string;      // e.g., "Birth Certificate"
  attachment: string; // URL or File path string
  student: Student;
  createdAt: string
  
  // Optional: If you include associations in your API response
  // student?: Student;
  academicYear?: AcademicYear;
  user?: User;
  uploader?: User;
  upload? :Document;
}

export interface DocumentType {
  type_id: number;
  name: string;
  isBatchesImported: boolean;
}
export interface SubFolderItem extends BaseEntity {
  file_id: number;
  name: string;
  folder_id: number;
  file_attachment: string;
  uploaded_by: number | null;
}

export interface Folder extends BaseEntity {
  folder_id: number;
  name: string;
  doctype_id: number;
  parent_folder_id: number | null;
  items: SubFolderItem[];
  children: Folder[];
}