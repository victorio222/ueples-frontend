import api from "../../utils/axiousInstance";
import { Document } from "../../types/models";
import { ApiResponse } from "../../types/api";

export const DocumentService = {
  // Upload a new file
  upload: (formData: FormData) =>
    api.post<ApiResponse<Document>>("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: (page = 1, limit = 10, lrn?: string | null) => {
    const params: any = { page, limit };
    if (lrn) params.lrn = lrn; // Append LRN to query string if present

    return api.get<
      ApiResponse<{
        documents: Document[];
        totalPages: number;
        totalItems: number;
      }>
    >("/documents", { params });
  },

  // getAll: (page = 1, limit = 10) =>
  //     api.get<ApiResponse<Document[]>>(`/documents?page=${page}&limit=${limit}`),

  // Get documents by Academic Year ID
  getByYear: (acad_year: string) =>
    api.get<ApiResponse<Document[]>>(`/documents/year/${acad_year}`),

  // Delete document and trigger file cleanup on backend
  delete: (id: number) => api.delete<ApiResponse<null>>(`/documents/${id}`),
};
