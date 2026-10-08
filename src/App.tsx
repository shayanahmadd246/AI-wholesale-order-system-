import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ClientApp } from './pages/ClientApp';
import { SupplierApp } from './pages/SupplierApp';
import { AdminApp } from './pages/AdminApp';
import { Store, Factory, Shield, ArrowRight, Sparkles, Smartphone, Award } from 'lucide-react';

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  // Path routing dispatcher
  const renderRoute = () => {
    if (pathname.startsWith('/client/login')) {
      return <LoginPage targetRole="client" />;
    }
    if (pathname.startsWith('/supplier/login')) {
      return <LoginPage targetRole="supplier" />;
    }
    if (pathname.startsWith('/admin/login')) {
      return <LoginPage targetRole="admin" />;
    }
    if (pathname.startsWith('/client')) {
      return <ClientApp />;
    }
    if (pathname.startsWith('/supplier')) {
      return <SupplierApp />;
    }
    if (pathname.startsWith('/admin')) {
      return <AdminApp />;
    }

    // Premium Luxury Charcoal Black, Warm Cream & Metallic Gold Landing Switcher
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1A1918] flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-[#C5A059] selection:text-black">
        {/* Clean Top Navbar Header */}
        <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-[#EAE5D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#0F0F0F] flex items-center justify-center font-bold font-display shadow-md">
              AI
            </div>
            <div>
              <h1 className="text-base font-extrabold font-display text-[#1A1918] tracking-tight flex items-center gap-2">
                Al-Madina AI Wholesale <span className="px-2 py-0.5 text-[10px] font-bold bg-[#121212] text-[#FAF7F2] rounded-md">Enterprise</span>
              </h1>
              <p className="text-xs text-[#78716C]">Multilingual Pashto · Urdu · English Ecosystem</p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 bg-white border border-[#EAE5D9] text-[#1A1918] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Portal Switcher Active
          </span>
        </header>

        {/* Hero & Portal Selection */}
        <main className="max-w-6xl mx-auto w-full my-auto py-12">
          <div className="text-center mb-12 space-y-3">
            <span className="px-3 py-1 bg-[#FAF4E6] border border-[#E8D7B0] text-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-lg inline-block">
              Luxury Wholesale AI Suite
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-[#1A1918] tracking-tight leading-tight">
              Select Portal Destination
            </h2>
            <p className="text-sm text-[#78716C] max-w-2xl mx-auto leading-relaxed font-normal">
              A high-performance B2B system connecting shopkeepers, suppliers, and central wholesalers with speech AI intelligence and strict credit controls.
            </p>
          </div>

          {/* Three Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Client App Card */}
            <div className="card-luxury p-8 flex flex-col justify-between group border-[#EAE5D9]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF4E6] border border-[#E8D7B0] text-[#C5A059] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] border border-[#EAE5D9] text-[#1A1918] rounded-md">
                  Mobile First · PWA
                </span>
                <h3 className="text-xl font-bold font-display text-[#1A1918] mt-3">Client Shopkeeper App</h3>
                <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
                  Order supplies via AI Voice & Text in Pashto, Urdu, or English. View dues, order timeline, and 1-tap reorders.
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigateTo('/client/login')}
                  className="w-full py-3.5 btn-gold rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Client Login & Sign Up</span>
                  <ArrowRight className="w-4 h-4 text-[#0F0F0F]" />
                </button>
              </div>
            </div>

            {/* Supplier App Card */}
            <div className="card-luxury p-8 flex flex-col justify-between group border-[#EAE5D9]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 text-[#1A1918] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Factory className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] border border-[#EAE5D9] text-[#1A1918] rounded-md">
                  Supplier Dashboard
                </span>
                <h3 className="text-xl font-bold font-display text-[#1A1918] mt-3">Supplier Partner App</h3>
                <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
                  Manage product stock levels and wholesale prices. Fulfill client orders and track payouts.
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigateTo('/supplier/login')}
                  className="w-full py-3.5 btn-charcoal rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Supplier Login</span>
                  <ArrowRight className="w-4 h-4 text-[#FAF7F2]" />
                </button>
              </div>
            </div>

            {/* Admin App Card */}
            <div className="card-luxury p-8 flex flex-col justify-between group border-[#EAE5D9]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF4E6] border border-[#E8D7B0] text-[#C5A059] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#121212] text-[#FAF7F2] rounded-md">
                  Central Master Admin
                </span>
                <h3 className="text-xl font-bold font-display text-[#1A1918] mt-3">Wholesaler Admin App</h3>
                <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
                  Full financial overview, sales/profit charts, unit cost prices, supplier permissions, client credit ledger & AI logs.
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigateTo('/admin/login')}
                  className="w-full py-3.5 btn-gold rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Admin Master Login</span>
                  <ArrowRight className="w-4 h-4 text-[#0F0F0F]" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-[#78716C] py-6 border-t border-[#EAE5D9]">
          Al-Madina AI Wholesale Platform — Luxury Enterprise Dashboard Architecture
        </footer>
      </div>
    );
  };

  return (
    <AuthProvider>
      {renderRoute()}
    </AuthProvider>
  );
}
