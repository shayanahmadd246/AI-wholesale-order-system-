import React, { useState, useEffect } from 'react';
import { Client, PaymentRecord } from '../../types';
import { getClientByIdApi } from '../../api/clients';
import { getPaymentsApi, recordPaymentApi } from '../../api/payments';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Wallet, CreditCard, ArrowUpRight, History, PlusCircle, CheckCircle2 } from 'lucide-react';

interface MyAccountViewProps {
  clientId: string;
}

export const MyAccountView: React.FC<MyAccountViewProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [methodInput, setMethodInput] = useState<'Bank Transfer' | 'Cash' | 'Cheque' | 'Mobile Wallet'>('Bank Transfer');
  const [refInput, setRefInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await getClientByIdApi(clientId);
      const p = await getPaymentsApi('client', clientId);
      setClient(c);
      setPayments(p);
    } catch (err: any) {
      setError(err.message || 'Failed to load ledger account data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || parseFloat(amountInput) <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleExecutePayment = async () => {
    setIsSubmitting(true);
    try {
      await recordPaymentApi({
        partyId: clientId,
        partyName: client?.shopName || 'Client',
        partyRole: 'client',
        type: 'ClientPayment',
        amount: parseFloat(amountInput),
        method: methodInput,
        reference: refInput || `REF-${Date.now().toString().slice(-6)}`
      });

      await fetchData();
      setShowPaymentModal(false);
      setConfirmModalOpen(false);
      setAmountInput('');
      setRefInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to record payment claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading account ledger..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const totalDues = client?.totalDues || 0;
  const creditLimit = client?.creditLimit || 100000;
  const creditUsagePercent = Math.min(100, Math.round((totalDues / creditLimit) * 100));

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-emerald-500" />
        <span>My Account & Ledger</span>
      </h2>

      {/* Dues Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 mb-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Outstanding Balance
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
            totalDues > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {totalDues > 0 ? 'Payment Due' : 'Clear Balance'}
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-mono font-black text-white mb-4">
          PKR {totalDues.toLocaleString()}
        </div>

        {/* Credit Bar */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Credit Limit Used</span>
            <span>{creditUsagePercent}% (Max PKR {creditLimit.toLocaleString()})</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                creditUsagePercent > 80 ? 'bg-red-500' : creditUsagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${creditUsagePercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="mt-5 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Payment Claim</span>
        </button>
      </div>

      {/* Payment History */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          <span>Recent Payment Receipts</span>
        </h3>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            No payments recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {payments.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{p.method}</p>
                  <p className="text-[11px] text-slate-400">Ref: {p.reference} · {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    + PKR {p.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-500 font-semibold">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Record Payment Claim
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter details of bank transfer or cash paid to update your ledger account.
            </p>

            <form onSubmit={handleOpenConfirm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount Paid (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={methodInput}
                  onChange={e => setMethodInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Wallet">Easypaisa / JazzCash</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / Deposit Ref #
                </label>
                <input
                  type="text"
                  value={refInput}
                  onChange={e => setRefInput(e.target.value)}
                  placeholder="e.g. TRX-992810"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirm Payment Submission"
        description="Are you sure you want to log this payment into your account ledger?"
        highlightText={`Amount: PKR ${parseFloat(amountInput || '0').toLocaleString()} (${methodInput})`}
        confirmLabel="Yes, Record Payment"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleExecutePayment}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};
