export const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 0) return [];
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let startPage = Math.max(1, currentPage - 1);

  if (startPage + 2 > totalPages) {
    startPage = totalPages - 2;
  }

  return [startPage, startPage + 1, startPage + 2];
};