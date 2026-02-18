import api from '../../utils/axiousInstance';
import { User } from '../../types/models';
import { ApiResponse } from '../../types/api';

export const UserService = {
    /**
     * Get all system users
     */
    getAll: () => 
        api.get<ApiResponse<User[]>>('/users'),

    /**
     * Get a single user by ID
     * Note: This route is protected by authToken in your backend
     */
    getById: (id: number) => 
        api.get<ApiResponse<User>>(`/users/${id}`),

    /**
     * Register a new user
     * Maps to: userRouter.post('/add', ...)
     */
    create: (data: any) => 
        api.post<ApiResponse<User>>('/users/add', data),

    /**
     * Update user details and profile image
     * Maps to: userRouter.put('/update/:id', ...)
     */
    update: (id: number, formData: FormData) => 
        api.put<ApiResponse<User>>(`/users/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    updateStatus: (id: number, status: string) => 
        api.put(`/users/update/status/${id}`, { status }),

    /**
     * Fetch all available roles for the dropdowns
     */
    getRoles: () => 
        api.get<ApiResponse<any[]>>('/roles'),
};