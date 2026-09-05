import api from '../../utils/axiousInstance';
import { User } from '../../types/models';
import { ApiResponse } from '../../types/api';

export const UserService = {
    getAll: () => 
        api.get<ApiResponse<User[]>>('/users'),

    getById: (id: number) => 
        api.get<ApiResponse<User>>(`/users/${id}`),

    create: (data: any) => 
        api.post<ApiResponse<User>>('/users/add', data),
    
    register: (data: any) => 
        api.post<ApiResponse<User>>('/auth/register', data),

    update: (id: number, formData: FormData) => 
        api.put<ApiResponse<User>>(`/users/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    updateStatus: (id: number, status: string) => 
        api.put(`/users/update/status/${id}`, { status }),

    updatePassword: (id: number, passwordData: { old_password: string; new_password: string }) => 
        api.patch(`/users/change-pass/${id}`, passwordData),

    getRoles: () => 
        api.get<ApiResponse<any[]>>('/roles'),
};