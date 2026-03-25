// // /**
// //  * Returns an array of page numbers to display.
// //  * Limits display to exactly 3 pages if possible.
// //  */
// // export const getVisiblePages = (currentPage: number, totalPages: number) => {
// //   // If total pages are 3 or less, just show all of them [1], [1, 2], or [1, 2, 3]
// //   if (totalPages <= 3) {
// //     return Array.from({ length: totalPages }, (_, i) => i + 1);
// //   }

// //   // Calculate start page so that currentPage is in the middle
// //   let startPage = currentPage - 1;

// //   // Guard: Don't let startPage go below 1
// //   if (startPage < 1) {
// //     startPage = 1;
// //   }

// //   // Guard: Don't let the window go past the total pages
// //   // If we are at the last page, startPage should be totalPages - 2
// //   if (startPage + 2 > totalPages) {
// //     startPage = totalPages - 2;
// //   }

// //   return [startPage, startPage + 1, startPage + 2];
// // };






// /**
//  * Returns an array of page numbers to display.
//  * Limits display to exactly 3 pages if possible.
//  * Returns an empty array if no pages exist.
//  */
// export const getVisiblePages = (currentPage: number, totalPages: number) => {
//   // --- GUARD: If no data found (0 pages) ---
//   if (totalPages <= 0) {
//     return [];
//   }

//   // If total pages are 3 or less, just show all of them [1], [1, 2], or [1, 2, 3]
//   if (totalPages <= 3) {
//     return Array.from({ length: totalPages }, (_, i) => i + 1);
//   }

//   // Calculate start page so that currentPage is in the middle
//   let startPage = currentPage - 1;

//   // Guard: Don't let startPage go below 1
//   if (startPage < 1) {
//     startPage = 1;
//   }

//   // Guard: Don't let the window go past the total pages
//   if (startPage + 2 > totalPages) {
//     startPage = totalPages - 2;
//   }

//   return [startPage, startPage + 1, startPage + 2];
// };




/**
 * Returns an array of page numbers to display.
 * Limits display to exactly 3 pages if possible.
 */
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