import { StudentService } from './services/studentService';
import { AcademicYearService } from './services/academicYearService';
import { DocumentService } from './services/documentService';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';

// This is your Global API object
const API = {
    students: StudentService,
    years: AcademicYearService,
    docs: DocumentService,
    auth: AuthService,
    users: UserService
};

export default API;