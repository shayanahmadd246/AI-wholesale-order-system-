import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { getOrdersApi, updateOrderStatusApi } from '../../api/orders';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { ShoppingBag, CheckCircle, Package, Truck, CheckCheck } from 'lucide-react';

interface SupplierOrderListProps {
  supplierId: string;
}

export const SupplierOrderList: React.FC<SupplierOrderListProps> = ({ supplierId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusTarget, setStatusTarget] = useState<{ orderId: string; orderNumber: string; newStatus: OrderStatus } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersApi('supplier', supplierId);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load supplier orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [supplierId]);

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

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-500" />
          <span>Supplier Client Orders</span>
        </h2>
        <p className="text-xs text-slate-500">
          Process and fulfill client wholesale orders that include your catalog items.
        </p>
      </div>

      {loading && <LoadingSpinner label="Loading client orders..." />}
      {error && <ErrorMessage message={error} onRetry={fetchOrders} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          title="No Orders Found"
          description="There are currently no wholesale orders including your products."
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs mr-2">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {order.clientShop} ({order.clientName})
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Status: {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-1.5 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.productName}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.quantity} x PKR {item.unitPrice.toLocaleString()} = PKR {item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-400">Total Order Value:</span>{' '}
                  <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    PKR {order.totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {order.status === 'Placed' && (
                    <button
                      onClick={() => setStatusTarget({ orderId: order.id, orderNumber: order.orderNumber, newStatus: 'Accepted' })}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept Order
                    </button>
                  )}

                  {(order.status === 'Placed' || order.status === 'Accepted') && (
                    <button
                      onClick={() => setStatusTarget({ orderId: order.id, orderNumber: order.orderNumber, newStatus: 'Packed' })}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
                    >
                      <Package className="w-3.5 h-3.5" /> Mark Packed
                    </button>
                  )}

                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button
                      onClick={() => setStatusTarget({ orderId: order.id, orderNumber: order.orderNumber, newStatus: 'Delivered' })}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" /> Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Confirmation Modal */}
      <ConfirmModal
        isOpen={!!statusTarget}
        title="Confirm Order Status Change"
        description={`Are you sure you want to change order ${statusTarget?.orderNumber} status to "${statusTarget?.newStatus}"?`}
        confirmLabel={`Yes, Mark as ${statusTarget?.newStatus}`}
        variant="primary"
        isLoading={isUpdating}
        onConfirm={handleExecuteStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
};
