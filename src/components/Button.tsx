import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  href?: string; 
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  fullWidth = false, 
  className = '', 
  href,
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center bg-[#824ca7] hover:bg-[#6d3e8e] text-white font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]";
  const widthClass = fullWidth ? "w-full" : "w-full md:w-auto";
  const combinedClasses = `${baseClasses} ${widthClass} ${className}`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Allow external onclick handlers if they exist (casting to any to bypass strict type mismatch for button vs anchor)
    if (onClick) {
        (onClick as any)(e);
    }
  };

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={handleLinkClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};