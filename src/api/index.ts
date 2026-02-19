import { StudentService } from './services/studentService';
import { AcademicYearService } from './services/academicYearService';
import { DocumentService } from './services/documentService';
import { AuthService } from './services/authService';
import { UserService } from './services/userService';
import { DashboardService } from './services/dashboardService';

// This is your Global API object
const API = {
    students: StudentService,
    years: AcademicYearService,
    docs: DocumentService,
    auth: AuthService,
    users: UserService,
    dashboard: DashboardService
};

export default API;