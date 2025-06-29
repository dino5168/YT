import {ref} from "vue";

let id = 0;

type ToastType = "info" | "success" | "error" | "warning";

export const toasts = ref<{id: number; type: ToastType; message: string}[]>([]);

export function useToast() {
  function showToast(
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) {
    const toast = {id: id++, type, message};
    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(toast.id);
    }, duration);
  }

  return {showToast};
}

export function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}
