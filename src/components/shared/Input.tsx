
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, containerClassName = "mb-4", className, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
        <input
          id={id}
          ref={ref} 
          className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';