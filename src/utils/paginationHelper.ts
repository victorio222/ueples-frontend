// /**
//  * Returns an array of page numbers to display.
//  * Limits display to 3 pages (e.g., [1, 2, 3] or [4, 5, 6])
//  */
// export const getVisiblePages = (currentPage: number, totalPages: number) => {
//   const halfWindow = Math.floor(3 / 2); // Result is 1
//   let startPage = Math.max(currentPage - halfWindow, 1);
//   let endPage = startPage + 3 - 1;

//   if (endPage > totalPages) {
//     endPage = totalPages;
//     startPage = Math.max(endPage - 3 + 1, 1);
//   }

//   return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
// };







/**
 * Returns an array of page numbers to display.
 * Limits display to exactly 3 pages if possible.
 */
export const getVisiblePages = (currentPage: number, totalPages: number) => {
  // If total pages are 3 or less, just show all of them [1], [1, 2], or [1, 2, 3]
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calculate start page so that currentPage is in the middle
  let startPage = currentPage - 1;

  // Guard: Don't let startPage go below 1
  if (startPage < 1) {
    startPage = 1;
  }

  // Guard: Don't let the window go past the total pages
  // If we are at the last page, startPage should be totalPages - 2
  if (startPage + 2 > totalPages) {
    startPage = totalPages - 2;
  }

  return [startPage, startPage + 1, startPage + 2];
};