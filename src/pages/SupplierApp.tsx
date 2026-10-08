import React, { useState } from 'react';
import { RouteGuard } from '../components/common/RouteGuard';
import { useAuth } from '../context/AuthContext';
import { SupplierNavbar } from '../components/supplier/SupplierNavbar';
import { SupplierDashboard } from '../components/supplier/SupplierDashboard';
import { SupplierProductList } from '../components/supplier/SupplierProductList';
import { SupplierOrderList } from '../components/supplier/SupplierOrderList';
import { SupplierClientList } from '../components/supplier/SupplierClientList';
import { SupplierPaymentList } from '../components/supplier/SupplierPaymentList';
import { PWAOfflineIndicator } from '../components/common/PWAOfflineIndicator';
import { LayoutDashboard, Package, ShoppingBag, Users, Wallet } from 'lucide-react';

export const SupplierApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'clients' | 'payments'>('dashboard');

  const supplierId = user?.supplierId || 'sup-1';
  const supplierName = user?.companyName || user?.name || 'Khyber Agri Foods Ltd';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'payments', label: 'Payments & Payouts', icon: Wallet }
  ];

  return (
    <RouteGuard requiredRole="supplier">
      <div className="min-h-screen bg-[#FAF7F2] text-[#1A1918] flex flex-col font-sans">
        <SupplierNavbar />

        {/* Supplier Navigation Tabs */}
        <div className="bg-[#121212] border-b border-[#262422] px-4 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#C5A059] text-[#0F0F0F] shadow-md'
                      : 'text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#22201D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && (
            <SupplierDashboard supplierId={supplierId} onNavigateTab={tab => setActiveTab(tab as any)} />
          )}
          {activeTab === 'products' && (
            <SupplierProductList supplierId={supplierId} supplierName={supplierName} />
          )}
          {activeTab === 'orders' && <SupplierOrderList supplierId={supplierId} />}
          {activeTab === 'clients' && <SupplierClientList supplierId={supplierId} />}
          {activeTab === 'payments' && <SupplierPaymentList supplierId={supplierId} />}
        </main>

        <PWAOfflineIndicator />
      </div>
    </RouteGuard>
  );
};
