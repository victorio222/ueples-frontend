import api from '../../utils/axiousInstance';
import { ApiResponse } from '../../types/api';

export interface AcademicYearStats {
    totalUsers: number;
    totalStudents: number;
    totalUploads: number;
}

export const DashboardService = {
    getDashboardStats: (ay: string) => 
        api.get<ApiResponse<any>>(`/stats/dashboard?academicYear=${ay}`), 
};