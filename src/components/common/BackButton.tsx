import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = 'Back',
  className = '',
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (to) {
      e.preventDefault();
      window.history.pushState({}, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FAF7F2] hover:text-[#C5A059] bg-[#1C1A18] hover:bg-[#282522] border border-[#2A2825] rounded-xl transition-all shadow-xs shrink-0 ${className}`}
      title={label}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};
