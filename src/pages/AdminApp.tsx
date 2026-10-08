import React, { useState } from 'react';
import { RouteGuard } from '../components/common/RouteGuard';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminOrderList } from '../components/admin/AdminOrderList';
import { AdminProductList } from '../components/admin/AdminProductList';
import { AdminSupplierList } from '../components/admin/AdminSupplierList';
import { AdminClientList } from '../components/admin/AdminClientList';
import { AdminPaymentList } from '../components/admin/AdminPaymentList';
import { AdminReportView } from '../components/admin/AdminReportView';
import { AdminTeamList } from '../components/admin/AdminTeamList';
import { AdminAIActivityLog } from '../components/admin/AdminAIActivityLog';
import { PWAOfflineIndicator } from '../components/common/PWAOfflineIndicator';

export const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-[#F7F5F2] text-[#171717] flex flex-col font-sans">
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 flex overflow-hidden">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'orders' && <AdminOrderList />}
              {activeTab === 'products' && <AdminProductList />}
              {activeTab === 'suppliers' && <AdminSupplierList />}
              {activeTab === 'clients' && <AdminClientList />}
              {activeTab === 'payments' && <AdminPaymentList />}
              {activeTab === 'reports' && <AdminReportView />}
              {activeTab === 'admins' && <AdminTeamList />}
              {activeTab === 'ai_logs' && <AdminAIActivityLog />}
            </div>
          </main>
        </div>

        <PWAOfflineIndicator />
      </div>
    </RouteGuard>
  );
};
