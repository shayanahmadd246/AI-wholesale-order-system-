import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { BackButton } from '../common/BackButton';
import { Store, LogOut, Phone } from 'lucide-react';

export const ClientNavbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#121212] border-b border-[#262422] text-[#FAF7F2] px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Brand / Shopkeeper Info */}
        <div className="flex items-center gap-2 min-w-0">
          <BackButton to="/" label="Portals" className="bg-[#22201D] hover:bg-[#2D2A26] text-[#FAF7F2] border-[#38342F]" />

          <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-[#0F0F0F] flex items-center justify-center shrink-0 font-bold font-display shadow-md">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold font-display text-[#FAF7F2] truncate leading-tight">
              {user?.shopName || 'Client Shop'}
            </h1>
            <p className="text-[10px] text-[#A39E93] flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>{user?.phone}</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <PWAInstallButton />
          <LanguageSwitcher />
          <button
            onClick={logout}
            className="p-1.5 text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#282522] rounded-xl transition-colors border border-[#2A2825]"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
