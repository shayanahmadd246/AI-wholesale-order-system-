import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BackButton } from '../common/BackButton';
import { Shield, LogOut, Menu, UserCheck } from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Inventory' },
    { id: 'ai_logs', label: 'AI Assistant' },
    { id: 'reports', label: 'Reports' },
    { id: 'admins', label: 'Manager Area' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#121212] border-b border-[#262422] text-[#FAF7F2] px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-[#A39E93] hover:text-white rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <BackButton to="/" label="Portals" className="bg-[#22201D] hover:bg-[#2D2A26] text-[#FAF7F2] border-[#38342F]" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#0F0F0F] flex items-center justify-center font-bold font-display text-sm shadow-md shrink-0">
              AI
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-display text-[#FAF7F2] tracking-tight">
                Al-Madina Wholesale
              </h1>
              <span className="text-[10px] text-[#C5A059] font-medium tracking-wider uppercase">Luxury Enterprise Suite</span>
            </div>
          </div>
        </div>

        {/* Middle Navigation Links (Desktop) */}
        {setActiveTab && (
          <nav className="hidden md:flex items-center gap-1 bg-[#1C1A18] p-1 rounded-xl border border-[#2A2825]">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#C5A059] text-[#0F0F0F] shadow-sm font-bold'
                      : 'text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#282522]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#FAF7F2]">{user?.name}</span>
            <span className="text-[10px] text-[#C5A059] font-mono uppercase tracking-wider">Master Admin</span>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-[#1C1A18] hover:bg-[#282522] text-[#FAF7F2] rounded-xl transition-colors border border-[#2A2825]"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
