import React, { useState, useEffect } from 'react';
import { getSalesReportApi, SalesReportSummary } from '../../api/reports';
import { getProductsApi } from '../../api/products';
import { getClientsApi } from '../../api/clients';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Award,
  Users,
  BarChart2,
  Sparkles,
  ArrowRight,
  Package,
  Boxes
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [report, setReport] = useState<SalesReportSummary | null>(null);
  const [pendingDues, setPendingDues] = useState<number>(0);
  const [totalStockValue, setTotalStockValue] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [topClients, setTopClients] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rep, prods, clis] = await Promise.all([
          getSalesReportApi('admin'),
          getProductsApi('admin'),
          getClientsApi('admin')
        ]);

        setReport(rep);

        const totalD = clis.reduce((acc, c) => acc + c.totalDues, 0);
        setPendingDues(totalD);

        const stockVal = prods.reduce((acc, p) => acc + (p.stock * p.wholesalePrice), 0);
        setTotalStockValue(stockVal);

        const low = prods.filter(p => p.stock <= p.lowStockThreshold).length;
        setLowStockCount(low);

        const sortedClients = [...clis].sort((a, b) => b.totalDues - a.totalDues).slice(0, 5);
        setTopClients(sortedClients);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin overview dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Compiling wholesale financial overview & charts..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!report) return null;

  return (
    <div className="space-y-8">
      {/* 2. Hero Area (Executive Luxury Charcoal & Gold) */}
      <div className="card-charcoal p-8 sm:p-10 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-[#2A2825]">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold rounded-lg tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Executive Luxury Overview
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight tracking-tight text-[#FAF7F2]">
            Wholesale Operations & AI Command
          </h1>

          <p className="text-sm text-[#A39E93] leading-relaxed font-normal">
            Real-time stock valuation, profit margin analysis, supplier inventory flow, and multilingual Pashto, Urdu, and English AI speech ordering.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#inventory"
              className="btn-gold py-3 px-5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#C5A059]/10"
            >
              <span>Manage Inventory Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#0F0F0F]" />
            </a>
          </div>
        </div>

        {/* Attractive AI Visual Summary Box */}
        <div className="p-6 bg-[#1C1A18] rounded-2xl border border-[#2A2825] shrink-0 w-full lg:w-80 relative z-10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-[#A39E93]">
            <span>AI Engine Status</span>
            <span className="text-[#C5A059] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" /> Active
            </span>
          </div>

          <div>
            <span className="text-xs text-[#A39E93] block">Total Catalog Valuation</span>
            <span className="text-2xl font-bold font-display text-[#FAF7F2] font-mono mt-0.5 block">
              PKR {totalStockValue.toLocaleString()}
            </span>
          </div>

          <div className="pt-3 border-t border-[#2A2825] flex items-center justify-between text-xs">
            <span className="text-[#E5DFD3] font-medium">Net Profit Margin:</span>
            <span className="font-bold text-[#C5A059] font-mono text-sm">{report.profitMarginPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 3. Dashboard KPI Cards (Colossal Gold & Charcoal Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Stock Valuation */}
        <div className="card-luxury p-5 border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">Total Stock</span>
            <div className="p-2 bg-[#FAF4E6] text-[#C5A059] rounded-xl border border-[#E8D7B0]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-[#1A1918] font-mono tracking-tight">
            PKR {(totalStockValue / 1000000).toFixed(2)}M
          </p>
          <p className="text-[11px] text-[#78716C] mt-1">PKR {totalStockValue.toLocaleString()}</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="card-luxury p-5 border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">Low Stock Alerts</span>
            <div className="p-2 bg-stone-100 text-[#1A1918] rounded-xl border border-stone-200">
              <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-[#1A1918] font-mono tracking-tight">
            {lowStockCount} Items
          </p>
          <p className="text-[11px] text-[#C5A059] font-bold mt-1">Needs restock order</p>
        </div>

        {/* Gross Sales */}
        <div className="card-luxury p-5 border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 bg-[#FAF4E6] text-[#C5A059] rounded-xl border border-[#E8D7B0]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-[#1A1918] font-mono tracking-tight">
            PKR {report.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#78716C] mt-1">{report.totalOrdersCount} orders executed</p>
        </div>

        {/* Net Profit */}
        <div className="card-luxury p-5 border-l-4 border-l-[#C5A059] border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Net Profit</span>
            <div className="p-2 bg-[#FAF4E6] text-[#C5A059] rounded-xl border border-[#E8D7B0]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-[#C5A059] font-mono tracking-tight">
            PKR {report.totalProfit.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#C5A059] font-bold mt-1">
            {report.profitMarginPercent.toFixed(1)}% margin
          </p>
        </div>

        {/* Pending Client Dues */}
        <div className="card-luxury p-5 border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">Credit Dues</span>
            <div className="p-2 bg-stone-100 text-[#1A1918] rounded-xl border border-stone-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-[#1A1918] font-mono tracking-tight">
            PKR {pendingDues.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#78716C] mt-1">Outstanding receivables</p>
        </div>
      </div>

      {/* 4. Charts Section (Stock Movement & Monthly Sales) */}
      <div className="card-luxury p-6 sm:p-8 border-[#EAE5D9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold font-display text-[#1A1918] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#C5A059]" />
              <span>Stock Movement & Sales Revenue Trends</span>
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">Comparative inventory sales vs net profit curves</p>
          </div>

          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE5D9]">
            {(['day', 'week', 'month'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                  timeframe === tf
                    ? 'bg-[#1A1918] text-[#FAF7F2] shadow-xs font-bold'
                    : 'text-[#78716C] hover:text-[#1A1918]'
                }`}
              >
                {tf}ly
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Bar Chart */}
        <div className="h-56 flex items-end justify-around gap-3 pt-8 pb-3 border-b border-[#EAE5D9]">
          {report.salesByDay.map((d, idx) => {
            const maxVal = Math.max(...report.salesByDay.map(s => s.sales), 50000);
            const salesHeight = Math.max(15, (d.sales / maxVal) * 100);
            const profitHeight = Math.max(8, (d.profit / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute -top-14 hidden group-hover:flex flex-col items-center bg-[#1A1918] text-[#FAF7F2] text-[11px] p-2.5 rounded-xl z-20 shadow-xl whitespace-nowrap border border-[#2A2825]">
                  <span>Date: {d.date}</span>
                  <span className="text-[#C5A059] font-bold">Revenue: PKR {d.sales.toLocaleString()}</span>
                  <span className="text-white font-bold">Profit: PKR {d.profit.toLocaleString()}</span>
                </div>

                <div className="w-full flex items-end justify-center gap-1.5 h-40">
                  {/* Sales Bar (Charcoal Black) */}
                  <div
                    className="w-3/7 bg-[#1A1918] hover:bg-[#2A2826] rounded-t-sm transition-all"
                    style={{ height: `${salesHeight}%` }}
                  />
                  {/* Profit Bar (Metallic Gold) */}
                  <div
                    className="w-3/7 bg-[#C5A059] hover:bg-[#B59048] rounded-t-sm transition-all"
                    style={{ height: `${profitHeight}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#78716C] font-mono truncate max-w-[60px]">{d.date.slice(-5)}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-8 mt-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#1A1918] rounded-xs" />
            <span className="text-[#1A1918]">Gross Sales Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#C5A059] rounded-xs" />
            <span className="text-[#1A1918]">Net Wholesaler Profit</span>
          </div>
        </div>
      </div>

      {/* Top Performing Items & Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="card-luxury p-6 border-[#EAE5D9]">
          <h3 className="text-base font-bold font-display text-[#1A1918] mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Top Performing Catalog Supplies</span>
          </h3>
          <div className="space-y-2.5">
            {report.topSellingProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl text-xs border border-[#EAE5D9]">
                <div>
                  <p className="font-bold text-[#1A1918]">{p.name}</p>
                  <p className="text-[11px] text-[#78716C]">{p.quantity} units sold</p>
                </div>
                <p className="font-mono font-bold text-[#C5A059]">
                  PKR {p.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients by Credit Dues */}
        <div className="card-luxury p-6 border-[#EAE5D9]">
          <h3 className="text-base font-bold font-display text-[#1A1918] mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C5A059]" />
            <span>Key Shopkeeper Credit Accounts</span>
          </h3>
          <div className="space-y-2.5">
            {topClients.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl text-xs border border-[#EAE5D9]">
                <div>
                  <p className="font-bold text-[#1A1918]">{c.shopName}</p>
                  <p className="text-[11px] text-[#78716C]">{c.name} · {c.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#C5A059]">
                    PKR {c.totalDues.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold ${c.status === 'Active' ? 'text-[#1A1918]' : 'text-stone-500'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
