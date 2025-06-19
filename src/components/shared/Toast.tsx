
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle size={24} className="text-green-100" />,
  error: <AlertTriangle size={24} className="text-red-100" />,
  info: <Info size={24} className="text-blue-100" />,
};

const bgColors = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 350); 
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const handleImmediateClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 350); 
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[100] p-4 rounded-md shadow-2xl text-white flex items-center space-x-3
                  transition-all duration-300 ease-in-out transform
                  ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                  ${bgColors[type]}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div>{icons[type]}</div>
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button
        onClick={handleImmediateClose}
        className="p-1 -mr-1 -mt-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/60"
        aria-label="Cerrar notificación"
      >
        <X size={18} />
      </button>
    </div>
  );
};