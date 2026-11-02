import Swal from 'sweetalert2';

// Mirrors the Swal.fire({ toast:true, type:'success', ... }) calls in the Angular app.
// (sweetalert2 v11 renamed `type` to `icon`.)

export function toastSuccess(title: string, timer = 1500) {
  return Swal.fire({
    toast: true,
    position: 'top',
    icon: 'success',
    title,
    showConfirmButton: false,
    timer,
  });
}

export function toastError(title: string, timer = 2000) {
  return Swal.fire({
    toast: true,
    position: 'top',
    icon: 'error',
    title,
    showConfirmButton: false,
    timer,
  });
}

export function toastWarning(title: string, timer = 2000) {
  return Swal.fire({
    toast: true,
    position: 'top',
    icon: 'warning',
    title,
    showConfirmButton: false,
    timer,
  });
}

export function confirmDialog(title: string, text = '') {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
  });
}

export { Swal };
