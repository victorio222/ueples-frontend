import api from "../../utils/axiousInstance";
import { Document, DocumentType, SubFolderItem, Folder } from "../../types/models";
import { ApiResponse } from "../../types/api";

export const DocumentService = {
  upload: (formData: FormData) =>
    api.post<ApiResponse<Document>>("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: (page = 1, limit = 10, lrn?: string | null) => {
    // const params: any = { page, limit };
    // if (lrn) params.lrn = lrn;

    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (lrn) {
      params.lrn = lrn;
    }

    return api.get<
      ApiResponse<{
        documents: Document[];
        totalPages: number;
        totalItems: number;
      }>
    >("/documents", { params });
  },

  getById: (doctypeId: string | number) =>
    api.get<ApiResponse<DocumentType>>(`/documents/type/name/${doctypeId}`),

  getByYear: (acad_year: string) =>
    api.get<ApiResponse<Document[]>>(`/documents/year/${acad_year}`),

  getFolderTree: (doctypeId: number) =>
    api.get<ApiResponse<Folder[]>>(`/folders/tree/${doctypeId}`),

  getSubFolders: (parentId: string | number) =>
    api.get<ApiResponse<Folder[]>>(`/folders/sub/${parentId}`),

  creatRootFolder: (data: Partial<Folder>) =>
    api.post<ApiResponse<Folder>>("/folders/main", data),

  createSubFolder: (data: Partial<Folder>) =>
    api.post<ApiResponse<Folder>>("/folders/sub", data),

  renameFolder: (id: number, data: { name: string }) =>
    api.patch<ApiResponse<Folder>>(`/folders/update/${id}`, data),

  renameFile: (id: number, data: { name: string }) =>
    api.patch<ApiResponse<Folder>>(`/uploaded/files/update/${id}`, data),

  deleteFolder: (id: number) =>
    api.delete<ApiResponse<Folder>>(`/folders/delete/${id}`),

  uploadToFolder: (formData: FormData) =>
    api.post<ApiResponse<SubFolderItem>>("/folders/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getFilesByFolder: (folderId: string | number) =>
    api.get<ApiResponse<SubFolderItem[]>>(`/uploaded/files/${folderId}`),

  getTypes: () =>
    api.get<ApiResponse<DocumentType[]>>("/documents/type"),

  delete: (id: number) => api.delete<ApiResponse<null>>(`/documents/${id}`),

  deleteFile: (id: number) => api.delete<ApiResponse<null>>(`/folders/delete/file/${id}`),
};
