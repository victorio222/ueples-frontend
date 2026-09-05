import api from '../../utils/axiousInstance';
import { User } from '../../types/models';
import { ApiResponse } from '../../types/api';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export const AuthService = {
  login: (credentials: LoginCredentials) => 
    api.post<ApiResponse<User>>('/auth/login', credentials),

  logout: (email: string) => 
    api.post<ApiResponse<null>>('/auth/logout', { email }),

  getCurrentUser: () => 
    api.get<ApiResponse<User>>('/auth/me'),
};