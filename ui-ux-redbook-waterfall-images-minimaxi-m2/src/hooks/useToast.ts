import { useState, useCallback } from 'react'
import { ToastType } from '../components/Toast'

interface ToastState {
  message: string
  type: ToastType
  isVisible: boolean
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  return {
    toast,
    showToast,
    hideToast,
  }
}
