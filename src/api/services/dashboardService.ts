import api from '../../utils/axiousInstance';
import { ApiResponse } from '../../types/api';

// Define a type for Dashboard-specific stats
export interface AcademicYearStats {
    totalUsers: number;
    totalStudents: number;
    totalUploads: number;
}

// Example update to your service definition
export const DashboardService = {
    getDashboardStats: (ay: string) => 
        api.get<ApiResponse<any>>(`/stats/dashboard?academicYear=${ay}`), 
};