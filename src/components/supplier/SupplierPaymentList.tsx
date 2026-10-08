import React, { useState, useEffect } from 'react';
import { PaymentRecord, Supplier } from '../../types';
import { getPaymentsApi } from '../../api/payments';
import { getSupplierByIdApi } from '../../api/suppliers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Wallet, CheckCircle2, Clock } from 'lucide-react';

interface SupplierPaymentListProps {
  supplierId: string;
}

export const SupplierPaymentList: React.FC<SupplierPaymentListProps> = ({ supplierId }) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [p, s] = await Promise.all([
          getPaymentsApi('supplier', supplierId),
          getSupplierByIdApi(supplierId)
        ]);
        setPayments(p);
        setSupplier(s);
      } catch (err: any) {
        setError(err.message || 'Failed to load supplier payment ledger');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supplierId]);

  if (loading) return <LoadingSpinner label="Loading payout statement..." />;
  if (error) return <ErrorMessage message={error} />;

  const pendingPayout = supplier?.pendingPayout || 0;
  const totalSales = supplier?.totalSales || 0;

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Wholesaler Payout (Owed to You)
          </span>
          <div className="text-2xl font-mono font-extrabold text-amber-500 mt-2">
            PKR {pendingPayout.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Disbursed weekly by central wholesaler</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Lifetime Sales Volume
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-500 mt-2">
            PKR {totalSales.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Gross sales generated through portal</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-blue-500" />
          <span>Completed Payout Transfers</span>
        </h3>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No payout records found.</p>
        ) : (
          <div className="space-y-2">
            {payments.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{p.method}</p>
                  <p className="text-[11px] text-slate-400">Ref: {p.reference} · {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-extrabold text-emerald-500">
                    + PKR {p.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Transferred
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
