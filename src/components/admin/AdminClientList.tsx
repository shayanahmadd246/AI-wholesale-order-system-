import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { getClientsApi, addClientApi, toggleBlockClientApi } from '../../api/clients';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Users, Plus, Phone, MapPin, Store, Lock, Unlock, CreditCard } from 'lucide-react';

export const AdminClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newShop, setNewShop] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCnic, setNewCnic] = useState('');
  const [newCity, setNewCity] = useState('Peshawar');
  const [newAddress, setNewAddress] = useState('');
  const [newCredit, setNewCredit] = useState<number>(100000);
  const [newLang, setNewLang] = useState<'en' | 'ur' | 'ps'>('ps');

  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string; currentStatus: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientsApi('admin');
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addClientApi({
        name: newName,
        shopName: newShop,
        phone: newPhone,
        cnicNumber: newCnic,
        city: newCity,
        address: newAddress,
        creditLimit: newCredit,
        language: newLang,
        status: 'Active'
      });
      await fetchClients();
      setShowAddModal(false);
      setNewName('');
      setNewShop('');
      setNewCnic('');
    } catch (err: any) {
      alert(err.message || 'Failed to add client');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteToggleBlock = async () => {
    if (!blockTarget) return;
    setIsSaving(true);
    try {
      await toggleBlockClientApi(blockTarget.id);
      await fetchClients();
      setBlockTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle client block state');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>Shopkeeper Clients & Credit Dues</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control shopkeeper credit limits, view CNIC verification details, languages, and block non-paying accounts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2 px-4 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {loading && <LoadingSpinner label="Fetching shopkeepers directory..." />}
      {error && <ErrorMessage message={error} onRetry={fetchClients} />}

      {!loading && !error && clients.length === 0 && (
        <EmptyState title="No Clients Registered" description="Add your first shopkeeper client." />
      )}

      {!loading && !error && clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map(cli => {
            const isBlocked = cli.status === 'Blocked';

            return (
              <div
                key={cli.id}
                className={`card-minimal p-5 flex flex-col justify-between space-y-3 ${
                  isBlocked ? 'border-red-300 bg-red-50/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{cli.shopName}</h3>
                        <p className="text-xs text-slate-500">{cli.name} ({cli.city})</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${
                      isBlocked ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {cli.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3">
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-800" /> {cli.phone}</p>
                    {cli.cnicNumber && (
                      <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" /> CNIC: {cli.cnicNumber}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-800" /> {cli.address}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Credit Dues / Limit</span>
                    <span className="font-mono font-bold text-amber-700">
                      PKR {cli.totalDues.toLocaleString()} / {cli.creditLimit.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setBlockTarget({ id: cli.id, name: cli.shopName, currentStatus: cli.status })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition-colors ${
                      isBlocked
                        ? 'btn-primary'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Unblock
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Block Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register New Client Shop</h3>
            <form onSubmit={handleAddClient} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop / Store Name</label>
                <input
                  type="text"
                  required
                  value={newShop}
                  onChange={e => setNewShop(e.target.value)}
                  placeholder="e.g. Madina Super Wholesale Store"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Khan Muhammad"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CNIC Number</label>
                  <input
                    type="text"
                    required
                    value={newCnic}
                    onChange={e => setNewCnic(e.target.value)}
                    placeholder="17301-1234567-1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    placeholder="e.g. Peshawar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Credit Limit (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newCredit}
                    onChange={e => setNewCredit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="Gate #3, Karkhano Market, Jamrud Road, Peshawar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 btn-secondary text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 btn-primary text-xs font-bold rounded-xl shadow-md"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      <ConfirmModal
        isOpen={!!blockTarget}
        title={blockTarget?.currentStatus === 'Active' ? 'Block Client Account?' : 'Unblock Client Account?'}
        description={`Are you sure you want to ${blockTarget?.currentStatus === 'Active' ? 'block' : 'unblock'} "${blockTarget?.name}"?`}
        confirmLabel={blockTarget?.currentStatus === 'Active' ? 'Yes, Block Client' : 'Yes, Unblock Client'}
        variant={blockTarget?.currentStatus === 'Active' ? 'danger' : 'primary'}
        isLoading={isSaving}
        onConfirm={handleExecuteToggleBlock}
        onCancel={() => setBlockTarget(null)}
      />
    </div>
  );
};
