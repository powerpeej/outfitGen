import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'pink';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-400",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 focus:ring-slate-500 disabled:bg-slate-800 disabled:text-slate-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    pink: "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30 focus:ring-pink-500 disabled:bg-pink-800 disabled:text-pink-400",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading || disabled ? 'cursor-not-allowed opacity-80' : ''}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};