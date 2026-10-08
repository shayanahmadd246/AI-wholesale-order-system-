import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { getOrdersApi, updateOrderStatusApi } from '../../api/orders';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { ShoppingBag, Search, Filter, CheckCircle2 } from 'lucide-react';

export const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [statusTarget, setStatusTarget] = useState<{ orderId: string; orderNumber: string; newStatus: OrderStatus } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersApi('admin');
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load all orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleExecuteStatusChange = async () => {
    if (!statusTarget) return;
    setIsUpdating(true);
    try {
      await updateOrderStatusApi(statusTarget.orderId, statusTarget.newStatus);
      await fetchOrders();
      setStatusTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.clientShop.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders by number, client shop, or name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Accepted">Accepted</option>
            <option value="Packed">Packed</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner label="Fetching all wholesale orders..." />}
      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

      {!loading && !error && filteredOrders.length === 0 && (
        <EmptyState title="No Orders Match Filter" description="Try clearing your search or status filters." />
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Order #</th>
                  <th className="p-3.5">Client Shop</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Items Summary</th>
                  <th className="p-3.5 text-right">Total (PKR)</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Quick Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {o.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{o.clientShop}</p>
                      <p className="text-[11px] text-slate-400">{o.clientName}</p>
                    </td>
                    <td className="p-3.5 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      PKR {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <select
                        value={o.status}
                        onChange={e => setStatusTarget({ orderId: o.id, orderNumber: o.orderNumber, newStatus: e.target.value as OrderStatus })}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold text-slate-900 dark:text-white"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!statusTarget}
        title="Override Order Status"
        description={`Are you sure you want to change order ${statusTarget?.orderNumber} status to "${statusTarget?.newStatus}"?`}
        confirmLabel={`Yes, Set to ${statusTarget?.newStatus}`}
        variant="warning"
        isLoading={isUpdating}
        onConfirm={handleExecuteStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
};
