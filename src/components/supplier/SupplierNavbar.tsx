import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { BackButton } from '../common/BackButton';
import { Factory, LogOut, ShieldCheck } from 'lucide-react';

export const SupplierNavbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#121212] border-b border-[#262422] text-[#FAF7F2] px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <BackButton to="/" label="Portals" className="bg-[#22201D] hover:bg-[#2D2A26] text-[#FAF7F2] border-[#38342F]" />

          <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#0F0F0F] flex items-center justify-center font-bold shadow-md shrink-0 font-display">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold font-display text-[#FAF7F2] tracking-tight">
                {user?.companyName || 'Supplier Portal'}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4E6] text-[#C5A059] border border-[#E8D7B0] rounded-md">
                Supplier Partner
              </span>
            </div>
            <p className="text-xs text-[#A39E93] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Contact: {user?.name} ({user?.phone})</span>
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <PWAInstallButton />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1A18] hover:bg-[#282522] text-[#FAF7F2] text-xs font-semibold rounded-xl transition-colors border border-[#2A2825]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
