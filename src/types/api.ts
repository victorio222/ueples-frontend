// src/types/api.ts
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data: T;
  // For paginated results
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  documents?: T;
}