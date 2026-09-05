import api from "../../utils/axiousInstance";
import { AcademicYear } from "../../types/models";
import { ApiResponse } from "../../types/api";

export const AcademicYearService = {
  getAll: () => api.get<ApiResponse<AcademicYear[]>>("/academic-years"),

  create: (label: string) =>
    api.post<ApiResponse<AcademicYear>>("/academic-years/add", {
      academic_year: label,
    }),

  getActive: () => api.get<ApiResponse<AcademicYear>>("/academic-years/active"),

  getByDocType: (type: string | null) =>
    api.get(`/academic-years?type=${encodeURIComponent(type || "")}`),

  getImportedByDocType: (doctypeId: string | number) =>
    api.get<ApiResponse<AcademicYear[]>>(
      `/academic-years/imported/${doctypeId}`,
    ),

  update: (id: number, data: Partial<AcademicYear>) =>
    api.patch<ApiResponse<AcademicYear>>(`/academic-years/${id}`, data),
};
