import Swal, { SweetAlertIcon } from "sweetalert2";

export const showAlert = (
  titleText = "something happened",
  alertType?: SweetAlertIcon
): void => {
  Swal.fire({
    titleText,
    position: "bottom-end",
    timer: 3500,
    timerProgressBar: true,
    toast: true,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: "Dismiss",
    icon: alertType,
    showClass: {
      popup: "swal2-noanimation",
      backdrop: "swal2-noanimation",
    },
    hideClass: {
      popup: "",
      backdrop: "",
    },
  });
};
