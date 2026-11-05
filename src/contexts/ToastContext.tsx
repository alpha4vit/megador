'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (message: string, itemTitle?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, itemTitle?: string, duration = 2500) => {
    const id = Date.now().toString();
    const newToast: Toast = { 
      id, 
      title: 'Товар добавлен',
      message: itemTitle ? `${itemTitle} успешно добавлен в корзину` : message,
      duration,
      isVisible: true
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Start exit animation after (duration - 300ms)
    setTimeout(() => {
      setToasts((prev) => prev.map((toast) => 
        toast.id === id ? { ...toast, isVisible: false } : toast
      ));
    }, duration - 300);
    
    // Remove from DOM after exit animation completes (300ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto transition-all duration-300 ease-in-out ${
              toast.isVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-full opacity-0'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{toast.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
