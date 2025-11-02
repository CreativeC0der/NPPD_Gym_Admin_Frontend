import Swal from 'sweetalert2';

// Dark theme configuration for SweetAlert
const darkThemeConfig = {
    background: '#1e293b', // slate-800
    color: '#ffffff',
    confirmButtonColor: '#9333ea', // purple-600
    cancelButtonColor: '#dc2626', // red-600
    customClass: {
        popup: 'dark-swal-popup',
        title: 'dark-swal-title',
        htmlContainer: 'dark-swal-text',
        confirmButton: 'dark-swal-confirm',
        cancelButton: 'dark-swal-cancel',
    }
};

// Configure default toast settings with dark theme
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    ...darkThemeConfig,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

// Success toast
export const showSuccessToast = (message: string) => {
    Toast.fire({
        icon: 'success',
        title: message
    });
};

// Error toast
export const showErrorToast = (message: string) => {
    Toast.fire({
        icon: 'error',
        title: message
    });
};

// Warning toast
export const showWarningToast = (message: string) => {
    Toast.fire({
        icon: 'warning',
        title: message
    });
};

// Info toast
export const showInfoToast = (message: string) => {
    Toast.fire({
        icon: 'info',
        title: message
    });
};

// Loading toast (for longer operations)
export const showLoadingToast = (message: string = 'Loading...') => {
    Toast.fire({
        icon: 'info',
        title: message,
        timer: 0, // Don't auto-close
        timerProgressBar: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

// Close any open toast
export const closeToast = () => {
    Swal.close();
};

// Confirmation dialog
export const showConfirmDialog = async (
    title: string,
    text?: string,
    confirmButtonText: string = 'Yes',
    cancelButtonText: string = 'Cancel'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        ...darkThemeConfig,
        confirmButtonText,
        cancelButtonText
    });

    return result.isConfirmed;
};
