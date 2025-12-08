import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-semibold transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gold-500 text-richBlack hover:bg-gold-400 hover:shadow-[0_0_15px_rgba(212,163,43,0.5)]",
    outline: "border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-richBlack"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};