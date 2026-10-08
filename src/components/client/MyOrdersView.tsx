import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { getOrdersApi, reorderPreviousOrderApi } from '../../api/orders';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Package, Clock, CheckCircle2, Truck, RotateCcw, ChevronRight, X } from 'lucide-react';

interface MyOrdersViewProps {
  clientId: string;
  language?: 'en' | 'ur' | 'ps';
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({ clientId, language = 'en' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reorderTarget, setReorderTarget] = useState<Order | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersApi('client', clientId);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [clientId]);

  const handleExecuteReorder = async () => {
    if (!reorderTarget) return;
    setIsReordering(true);
    try {
      await reorderPreviousOrderApi(reorderTarget.id);
      await fetchOrders();
      setReorderTarget(null);
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message || 'Failed to repeat order');
    } finally {
      setIsReordering(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const map = {
      Placed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      Accepted: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      Packed: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'Out for delivery': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30'
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${map[status] || 'bg-slate-800 text-slate-300'}`}>
        {status}
      </span>
    );
  };

  const statusSteps: OrderStatus[] = ['Placed', 'Packed', 'Out for delivery', 'Delivered'];

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-emerald-500" />
        <span>My Order History</span>
      </h2>

      {loading && <LoadingSpinner label="Fetching your wholesale orders..." />}
      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="No Orders Found"
          description="You haven't placed any wholesale orders yet. Chat with our AI assistant to order!"
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {order.orderNumber}
                </span>
                {getStatusBadge(order.status)}
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                <p className="font-medium truncate">
                  {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Placed: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                  PKR {order.totalAmount.toLocaleString()}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Order Details — {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Status Timeline */}
            <div className="mb-5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Order Progress</p>
              <div className="grid grid-cols-4 gap-1 text-center">
                {statusSteps.map((step, idx) => {
                  const currentIdx = statusSteps.indexOf(selectedOrder.status);
                  const isDone = currentIdx >= idx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] leading-tight ${isDone ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Items Ordered</p>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} x PKR {item.unitPrice.toLocaleString()} / {item.unit}
                    </p>
                  </div>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    PKR {item.totalPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Paid/Due Amount:</span>
              <span className="text-lg font-mono font-extrabold text-emerald-500">
                PKR {selectedOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReorderTarget(selectedOrder)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repeat This Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reorder */}
      <ConfirmModal
        isOpen={!!reorderTarget}
        title="Repeat Wholesale Order?"
        description={`This will automatically recreate an identical order for PKR ${reorderTarget?.totalAmount.toLocaleString()}.`}
        confirmLabel="Yes, Repeat Order"
        variant="primary"
        isLoading={isReordering}
        onConfirm={handleExecuteReorder}
        onCancel={() => setReorderTarget(null)}
      />
    </div>
  );
};
