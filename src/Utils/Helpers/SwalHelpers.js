import Swal from 'sweetalert2';

// Success alert
export const showSuccessAlert = (title = 'Berhasil!', message = 'Operasi berhasil dilakukan.', timer = 2000) => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    timer,
    timerProgressBar: true,
    showConfirmButton: timer > 3000,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  });
};

// Error alert
export const showErrorAlert = (title = 'Terjadi Kesalahan!', message = 'Operasi gagal. Silakan coba lagi.') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  });
};

// Warning alert
export const showWarningAlert = (title = 'Peringatan!', message = 'Harap perhatikan informasi berikut.') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  });
};

// Info alert
export const showInfoAlert = (title = 'Informasi', message) => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  });
};

// Confirmation alert
export const showConfirmAlert = ({
  title = 'Apakah Anda yakin?',
  message = 'Anda tidak dapat mengembalikan tindakan ini!',
  confirmText = 'Ya, lanjutkan!',
  cancelText = 'Batal',
  isDangerous = false
} = {}) => {
  return Swal.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: isDangerous ? '#d33' : '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  });
};

// Input alert
export const showInputAlert = ({
  title = 'Masukkan Informasi',
  inputLabel = 'Input',
  inputPlaceholder = 'Ketik di sini...',
  inputValue = '',
  inputType = 'text',
  confirmText = 'Simpan',
  cancelText = 'Batal',
  validationMessage = 'Kolom ini harus diisi'
} = {}) => {
  return Swal.fire({
    title,
    input: inputType,
    inputLabel,
    inputPlaceholder,
    inputValue,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    inputValidator: (value) => {
      if (!value) {
        return validationMessage;
      }
    }
  });
};

// Loading alert
export const showLoadingAlert = (title = 'Sedang Memproses...', message = 'Mohon tunggu sebentar.') => {
  return Swal.fire({
    title,
    text: message,
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false
  });
};

// Close current alert
export const closeAlert = () => {
  Swal.close();
};

export default {
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  showInfoAlert,
  showConfirmAlert,
  showInputAlert,
  showLoadingAlert,
  closeAlert
};