import api from '../../utils/axiousInstance';
import { Student } from '../../types/models';
import { ApiResponse } from '../../types/api';

export const StudentService = {
    getAll: (page = 1, limit = 10) => 
        api.get<ApiResponse<Student[]>>(`/students?page=${page}&limit=${limit}`),

    getById: (id: number) => 
        api.get<ApiResponse<Student>>(`/students/${id}`),

    create: (data: Partial<Student>) => 
        api.post<ApiResponse<Student>>('/students', data),

    // bulkImport: (students: any[]) => 
    //     api.post<ApiResponse<{ count: number }>>('/students/import', { students }),

    bulkImport: (formData: FormData) => 
        api.post<ApiResponse<{ count: number }>>('/students/import', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            }
        }),
    
    // For file uploads (using form-data)
    uploadProfile: (id: number, formData: FormData) => 
        api.post(`/students/${id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
};