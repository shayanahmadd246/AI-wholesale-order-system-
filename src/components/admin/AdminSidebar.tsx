import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  Bot,
  UserCheck,
  X
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'suppliers'
  | 'clients'
  | 'payments'
  | 'reports'
  | 'admins'
  | 'ai_logs';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingBag },
    { id: 'products' as AdminTab, label: 'Inventory & Stock', icon: Package },
    { id: 'suppliers' as AdminTab, label: 'Suppliers', icon: Building2 },
    { id: 'clients' as AdminTab, label: 'Clients & Credit', icon: Users },
    { id: 'payments' as AdminTab, label: 'Payments', icon: CreditCard },
    { id: 'reports' as AdminTab, label: 'Reports', icon: BarChart3 },
    { id: 'admins' as AdminTab, label: 'Manager Area', icon: UserCheck },
    { id: 'ai_logs' as AdminTab, label: 'AI Assistant Audit', icon: Bot }
  ];

  const handleSelect = (id: AdminTab) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#121212] text-[#FAF7F2] border-r border-[#262422] transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-[#262422]">
            <span className="font-bold font-display text-[#FAF7F2] text-sm tracking-wide">Navigation</span>
            <button onClick={onClose} className="p-1 text-[#A39E93] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 space-y-1.5 mt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#C5A059] text-[#0F0F0F] font-bold shadow-lg shadow-[#C5A059]/20'
                      : 'text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#22201D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F0F0F]' : 'text-[#A39E93]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Admin Summary Footer */}
        <div className="p-4 m-3 bg-[#1C1A18] rounded-xl border border-[#2A2825] text-[11px] text-[#A39E93]">
          <p className="font-bold font-display text-[#C5A059] uppercase tracking-wider">Luxury Executive Suite</p>
          <p className="mt-0.5 text-[#E5DFD3]">Master Wholesaler Controls</p>
        </div>
      </aside>
    </>
  );
};
