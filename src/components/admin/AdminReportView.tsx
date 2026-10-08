import React, { useState, useEffect } from 'react';
import { getSalesReportApi, SalesReportSummary } from '../../api/reports';
import { getSuppliersApi } from '../../api/suppliers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { BarChart3, Download, Printer, Filter, Calendar } from 'lucide-react';

export const AdminReportView: React.FC = () => {
  const [report, setReport] = useState<SalesReportSummary | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rep, sups] = await Promise.all([
        getSalesReportApi('admin', {
          supplierId: selectedSupplier || undefined,
          startDate,
          endDate
        }),
        getSuppliersApi()
      ]);
      setReport(rep);
      setSuppliers(sups);
    } catch (err: any) {
      setError(err.message || 'Failed to generate financial reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedSupplier, startDate, endDate]);

  const handleExportCSV = () => {
    if (!report) return;
    let csv = 'Date,Sales Revenue (PKR),Cost (PKR),Net Profit (PKR)\n';
    report.salesByDay.forEach(r => {
      csv += `${r.date},${r.sales},${r.sales - r.profit},${r.profit}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wholesale_Financial_Report_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner label="Generating comprehensive profit & sales statement..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReport} />;
  if (!report) return null;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-emerald-500" />
            <select
              value={selectedSupplier}
              onChange={e => setSelectedSupplier(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="">All Suppliers</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
            </select>
          </div>
        </div>

        {/* Export Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV / Excel
          </button>

          <button
            onClick={handlePrintPDF}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Financial Statement Summary Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
            Al-Madina AI Wholesale Corporation
          </h2>
          <p className="text-xs text-slate-500">Official Wholesale Profit & Revenue Audit Statement</p>
          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            Period: {startDate} to {endDate}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-slate-400 text-[11px] uppercase font-bold block">Gross Revenue</span>
            <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
              PKR {report.totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-slate-400 text-[11px] uppercase font-bold block">Cost of Goods (COGS)</span>
            <span className="text-lg font-mono font-extrabold text-slate-400">
              PKR {report.totalCost.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <span className="text-emerald-600 dark:text-emerald-400 text-[11px] uppercase font-bold block">Net Wholesaler Profit</span>
            <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">
              PKR {report.totalProfit.toLocaleString()}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
            <span className="text-slate-400 text-[11px] uppercase font-bold block">Profit Margin</span>
            <span className="text-lg font-mono font-extrabold text-emerald-500">
              {report.profitMarginPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Daily Financial Ledger Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Sales Revenue</th>
                <th className="p-3 text-right">Cost Price (COGS)</th>
                <th className="p-3 text-right">Net Wholesaler Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {report.salesByDay.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono text-slate-900 dark:text-white">{row.date}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    PKR {row.sales.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-400">
                    PKR {(row.sales - row.profit).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    + PKR {row.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
