import React, { useState, useEffect } from 'react';
import { PaymentRecord, Client, Supplier } from '../../types';
import { getPaymentsApi, recordPaymentApi } from '../../api/payments';
import { getClientsApi } from '../../api/clients';
import { getSuppliersApi } from '../../api/suppliers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { CreditCard, PlusCircle, CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const AdminPaymentList: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [partyType, setPartyType] = useState<'client' | 'supplier'>('client');
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [methodInput, setMethodInput] = useState<'Bank Transfer' | 'Cash' | 'Cheque'>('Bank Transfer');
  const [refInput, setRefInput] = useState('');

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c, s] = await Promise.all([
        getPaymentsApi('admin'),
        getClientsApi('admin'),
        getSuppliersApi()
      ]);
      setPayments(p);
      setClients(c);
      setSuppliers(s);
      if (c.length > 0) setSelectedPartyId(c[0].id);
    } catch (err: any) {
      setError(err.message || 'Failed to load master ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || parseFloat(amountInput) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleExecuteRecordPayment = async () => {
    setIsSubmitting(true);
    try {
      let partyName = '';
      if (partyType === 'client') {
        const c = clients.find(cli => cli.id === selectedPartyId);
        partyName = c ? `${c.shopName} (${c.name})` : 'Client';
      } else {
        const s = suppliers.find(sup => sup.id === selectedPartyId);
        partyName = s ? s.companyName : 'Supplier';
      }

      await recordPaymentApi({
        partyId: selectedPartyId,
        partyName,
        partyRole: partyType,
        type: partyType === 'client' ? 'ClientPayment' : 'SupplierPayout',
        amount: parseFloat(amountInput),
        method: methodInput,
        reference: refInput || `TRX-${Date.now().toString().slice(-6)}`
      });

      await fetchData();
      setShowModal(false);
      setConfirmModalOpen(false);
      setAmountInput('');
      setRefInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to record ledger transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalClientDuesSum = clients.reduce((acc, c) => acc + c.totalDues, 0);
  const totalSupplierPayoutsSum = suppliers.reduce((acc, s) => acc + s.pendingPayout, 0);

  return (
    <div className="space-y-4">
      {/* Top Ledger Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Owed by Clients</span>
            <ArrowDownLeft className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-500">
            PKR {totalClientDuesSum.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Outstanding receivables from shopkeepers</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Owed to Suppliers</span>
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-blue-500">
            PKR {totalSupplierPayoutsSum.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Pending payout disbursements</p>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            <span>Master Payment & Payout History</span>
          </h3>

          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>

        {loading && <LoadingSpinner label="Fetching master transaction audit history..." />}
        {error && <ErrorMessage message={error} onRetry={fetchData} />}

        {!loading && !error && payments.length === 0 && (
          <EmptyState title="No Transactions Recorded" description="Record client payments or supplier payouts." />
        )}

        {!loading && !error && payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Party / Entity</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference #</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        p.type === 'ClientPayment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {p.type === 'ClientPayment' ? 'Client Payment In' : 'Supplier Payout Out'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{p.partyName}</td>
                    <td className="p-3 text-slate-500">{p.method}</td>
                    <td className="p-3 font-mono text-slate-400">{p.reference}</td>
                    <td className="p-3 text-slate-500">{p.date}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      PKR {p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Record Ledger Transaction</h3>
            <form onSubmit={handleOpenConfirm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Transaction Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPartyType('client'); if (clients.length > 0) setSelectedPartyId(clients[0].id); }}
                    className={`py-2 text-xs font-bold rounded-xl border ${partyType === 'client' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    Receive Client Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPartyType('supplier'); if (suppliers.length > 0) setSelectedPartyId(suppliers[0].id); }}
                    className={`py-2 text-xs font-bold rounded-xl border ${partyType === 'supplier' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    Pay Supplier Disbursal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select {partyType === 'client' ? 'Client Shop' : 'Supplier Company'}
                </label>
                <select
                  value={selectedPartyId}
                  onChange={e => setSelectedPartyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                >
                  {partyType === 'client'
                    ? clients.map(c => <option key={c.id} value={c.id}>{c.shopName} ({c.name}) — Due: PKR {c.totalDues.toLocaleString()}</option>)
                    : suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName} — Pending: PKR {s.pendingPayout.toLocaleString()}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  required
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Method</label>
                  <select
                    value={methodInput}
                    onChange={e => setMethodInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reference #</label>
                  <input
                    type="text"
                    value={refInput}
                    onChange={e => setRefInput(e.target.value)}
                    placeholder="TRX-102931"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirm Ledger Transaction"
        description="Are you sure you want to log this monetary transaction into the central wholesale ledger?"
        highlightText={`Amount: PKR ${parseFloat(amountInput || '0').toLocaleString()} (${partyType.toUpperCase()})`}
        confirmLabel="Yes, Record Transaction"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleExecuteRecordPayment}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};
