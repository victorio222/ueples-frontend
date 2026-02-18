import api from '../../utils/axiousInstance';
import { AcademicYear } from '../../types/models';
import { ApiResponse } from '../../types/api';

export const AcademicYearService = {
    /**
     * Fetch all academic years from the database
     * GET /api/academic-years
     */
    getAll: () => 
        api.get<ApiResponse<AcademicYear[]>>('/academic-years'),

    /**
     * Create a new academic year (e.g., "2026-2027")
     * POST /api/academic-years
     */
    create: (label: string) => 
        api.post<ApiResponse<AcademicYear>>('/academic-years/add', { 
            academic_year: label 
        }),

    /**
     * Get the currently active academic year
     * GET /api/academic-years/active
     */
    getActive: () => 
        api.get<ApiResponse<AcademicYear>>('/academic-years/active'),

    /**
     * Update a specific year (e.g., marking it as active)
     * PATCH /api/academic-years/:id
     */
    update: (id: number, data: Partial<AcademicYear>) => 
        api.patch<ApiResponse<AcademicYear>>(`/academic-years/${id}`, data),
};