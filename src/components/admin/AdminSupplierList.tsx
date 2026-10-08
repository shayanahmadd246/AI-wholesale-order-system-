import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';
import { getSuppliersApi, addSupplierApi, updateSupplierPermissionsApi, deleteSupplierApi } from '../../api/suppliers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Building2, Plus, ShieldCheck, Trash2, KeyRound } from 'lucide-react';

export const AdminSupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategory, setNewCategory] = useState('Grains & Pulses');

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuppliersApi();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load suppliers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleTogglePermission = async (
    supplierId: string,
    key: 'canChangePrices' | 'canChangeStock',
    currentVal: boolean
  ) => {
    const s = suppliers.find(sup => sup.id === supplierId);
    if (!s) return;

    const newPermissions = {
      ...s.permissions,
      [key]: !currentVal
    };

    try {
      await updateSupplierPermissionsApi(supplierId, newPermissions);
      await fetchSuppliers();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle supplier permission');
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addSupplierApi({
        name: newName,
        companyName: newCompany,
        phone: newPhone,
        email: newEmail,
        category: newCategory,
        status: 'Active',
        permissions: {
          canChangePrices: true,
          canChangeStock: true
        }
      });
      await fetchSuppliers();
      setShowAddModal(false);
      setNewCompany('');
      setNewName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add supplier');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteSupplierApi(deleteTarget.id);
      await fetchSuppliers();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete supplier');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span>Supplier Network & Permissions</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage partner suppliers and toggle price/stock editing access rights.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {loading && <LoadingSpinner label="Fetching supplier network list..." />}
      {error && <ErrorMessage message={error} onRetry={fetchSuppliers} />}

      {!loading && !error && suppliers.length === 0 && (
        <EmptyState title="No Suppliers Registered" description="Add your first supplier company." />
      )}

      {!loading && !error && suppliers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map(sup => (
            <div
              key={sup.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{sup.companyName}</h3>
                    <p className="text-xs text-slate-500">Contact: {sup.name} ({sup.phone})</p>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {sup.category}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1 my-3">
                  <p>Email: {sup.email}</p>
                  <p className="font-mono">Total Portal Sales: PKR {sup.totalSales.toLocaleString()}</p>
                  <p className="font-mono text-amber-500">Pending Payout: PKR {sup.pendingPayout.toLocaleString()}</p>
                </div>
              </div>

              {/* Permissions Control Box */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Access Permissions (Affects His Products Only)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Can Change Prices */}
                  <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sup.permissions.canChangePrices}
                      onChange={() => handleTogglePermission(sup.id, 'canChangePrices', sup.permissions.canChangePrices)}
                      className="accent-emerald-600 rounded"
                    />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Change Prices</span>
                  </label>

                  {/* Can Change Stock */}
                  <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sup.permissions.canChangeStock}
                      onChange={() => handleTogglePermission(sup.id, 'canChangeStock', sup.permissions.canChangeStock)}
                      className="accent-emerald-600 rounded"
                    />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Change Stock</span>
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setDeleteTarget({ id: sup.id, name: sup.companyName })}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Supplier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Partner Supplier</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Peshawar Rice Traders Ltd"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Haji Sharbat Khan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Oils & Ghee">Oils & Ghee</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Sugar & Sweets">Sugar & Sweets</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="supplier@wholesale.pk"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Partner Supplier"
        description={`Are you sure you want to remove supplier "${deleteTarget?.name}"?`}
        confirmLabel="Yes, Remove Supplier"
        variant="danger"
        isLoading={isSaving}
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
