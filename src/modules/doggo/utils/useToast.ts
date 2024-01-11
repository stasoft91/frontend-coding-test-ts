import {
  type ToastProps,
  useToast as useToastNotification,
} from 'vue-toast-notification'

const $toast = useToastNotification()

export const useToast = () => {
  return {
    success: (message: string, options?: Partial<ToastProps>) => {
      $toast.success(message, {
        duration: 1000,
        position: 'top',
        ...options,
      })
    },
    error: (message: string, options?: Partial<ToastProps>) => {
      $toast.error(message, {
        duration: 1000,
        position: 'top',
        ...options,
      })
    },
    info: (message: string, options?: Partial<ToastProps>) => {
      $toast.info(message, {
        duration: 700,
        position: 'top',
        ...options,
      })
    },
  }
}
