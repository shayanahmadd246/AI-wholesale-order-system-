import React, { useState, useEffect } from 'react';
import { AdminUser } from '../../types';
import { getAdminsApi, addAdminApi, toggleAdminStatusApi, deleteAdminApi } from '../../api/admins';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserCheck, Plus, Shield, Phone, Mail, Lock, Unlock, Trash2 } from 'lucide-react';

export const AdminTeamList: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [toggleTarget, setToggleTarget] = useState<{ id: string; name: string; currentStatus: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminsApi();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin team list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addAdminApi({
        name: newName,
        email: newEmail,
        phone: newPhone,
        status: 'Active'
      });
      await fetchAdmins();
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
    } catch (err: any) {
      alert(err.message || 'Failed to add admin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteToggle = async () => {
    if (!toggleTarget) return;
    setIsSaving(true);
    try {
      await toggleAdminStatusApi(toggleTarget.id);
      await fetchAdmins();
      setToggleTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update admin status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteAdminApi(deleteTarget.id);
      await fetchAdmins();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to remove admin');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-500" />
            <span>Admin Team & Access Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Hire / Add another administrator to give full control over wholesale operations and financials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Admin</span>
        </button>
      </div>

      {loading && <LoadingSpinner label="Fetching admin team directory..." />}
      {error && <ErrorMessage message={error} onRetry={fetchAdmins} />}

      {!loading && !error && admins.length === 0 && (
        <EmptyState title="No Admins Found" description="Add another admin manager to your team." />
      )}

      {!loading && !error && admins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.map(adm => {
            const isActive = adm.status === 'Active';

            return (
              <div
                key={adm.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{adm.name}</h3>
                        <p className="text-xs text-slate-500">Super Administrator</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${
                      isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {adm.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 my-3">
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-purple-400" /> {adm.phone}</p>
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-purple-400" /> {adm.email}</p>
                    <p className="text-[11px] text-slate-400">Added Date: {adm.createdDate}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setToggleTarget({ id: adm.id, name: adm.name, currentStatus: adm.status })}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {isActive ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{isActive ? 'Deactivate Access' : 'Activate Access'}</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: adm.id, name: adm.name })}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Another Administrator</h3>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Asad Ullah Khan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="asad.admin@wholesale.pk"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+92 300 1234567"
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
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={!!toggleTarget}
        title="Toggle Admin Access Status"
        description={`Are you sure you want to change access status for "${toggleTarget?.name}"?`}
        confirmLabel="Yes, Update Access"
        variant="warning"
        isLoading={isSaving}
        onConfirm={handleExecuteToggle}
        onCancel={() => setToggleTarget(null)}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Administrator"
        description={`Are you sure you want to permanently remove admin "${deleteTarget?.name}"?`}
        confirmLabel="Yes, Remove Admin"
        variant="danger"
        isLoading={isSaving}
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
