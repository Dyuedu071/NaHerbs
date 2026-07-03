"use client";

import toast from 'react-hot-toast';

type ToastType = 'success' | 'error';

export function useToast() {
  const showToast = (message: string, type: ToastType = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return { showToast };
}
