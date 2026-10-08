import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { getOrdersApi, reorderPreviousOrderApi } from '../../api/orders';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ConfirmModal } from '../common/ConfirmModal';
import { RotateCcw, Zap, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface QuickReorderViewProps {
  clientId: string;
}

export const QuickReorderView: React.FC<QuickReorderViewProps> = ({ clientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderTarget, setReorderTarget] = useState<Order | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPastOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrdersApi('client', clientId);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastOrders();
  }, [clientId]);

  const handleExecuteReorder = async () => {
    if (!reorderTarget) return;
    setIsReordering(true);
    try {
      const newOrder = await reorderPreviousOrderApi(reorderTarget.id);
      setSuccessMessage(`Order #${newOrder.orderNumber} successfully created and placed!`);
      setReorderTarget(null);
      await fetchPastOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to repeat order');
    } finally {
      setIsReordering(false);
    }
  };

  if (loading) return <LoadingSpinner label="Fetching previous supplies for 1-tap reorder..." />;

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-500" />
        <span>One-Tap Quick Reorder</span>
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Instantly repeat your frequent wholesale supply orders with a single tap.
      </p>

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          title="No Previous Orders"
          description="Once you place your first order, it will appear here for fast 1-tap reordering."
        />
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {order.orderNumber}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.productName}</span>
                    <span className="text-slate-500 font-mono">{item.quantity} x PKR {item.unitPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</p>
                  <p className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    PKR {order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => setReorderTarget(order)}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!reorderTarget}
        title="Reorder Wholesale Supplies?"
        description={`Do you want to reorder ${reorderTarget?.items.length} items for PKR ${reorderTarget?.totalAmount.toLocaleString()}?`}
        confirmLabel="Yes, Repeat Order"
        variant="warning"
        isLoading={isReordering}
        onConfirm={handleExecuteReorder}
        onCancel={() => setReorderTarget(null)}
      />
    </div>
  );
};
