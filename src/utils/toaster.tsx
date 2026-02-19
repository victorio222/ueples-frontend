import Swal from "sweetalert2";

export const showAlert = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: "success",
      title,
      text,
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
      customClass: {
        popup: "rounded-2xl dark:bg-gray-900 dark:text-white",
      },
    });
  },

  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#3b82f6", // blue-600
      customClass: {
        popup: "rounded-2xl dark:bg-gray-900 dark:text-white",
      },
    });
  },

  confirm: (title: string, text: string) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, proceed!",
      customClass: {
        popup: "rounded-2xl dark:bg-gray-900 dark:text-white",
      },
    });
  },

  loading: (title: string) => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "rounded-2xl dark:bg-gray-900 dark:text-white",
      },
    });
  },

  close: () => Swal.close(),
};