import { useEffect } from 'react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg border ${bgColors[type]} z-50 flex items-center gap-3 min-w-[300px]`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-current opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};

