
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-8 py-4 font-black transition-all duration-500 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 text-richBlack hover:shadow-[0_15px_30px_-10px_rgba(212,163,43,0.4)] hover:-translate-y-0.5",
    outline: "border border-gold-500/50 text-gold-500 hover:bg-gold-500/10 hover:border-gold-500 shadow-xl",
    ghost: "text-zinc-500 hover:text-gold-500 hover:bg-zinc-800/50"
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
