import React, { useState, useEffect } from 'react';
import { Order, Product } from '../../types';
import { getOrdersApi } from '../../api/orders';
import { getProductsApi } from '../../api/products';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { ShoppingBag, DollarSign, AlertTriangle, PackageCheck } from 'lucide-react';

interface SupplierDashboardProps {
  supplierId: string;
  onNavigateTab: (tab: string) => void;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ supplierId, onNavigateTab }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ord, prod] = await Promise.all([
          getOrdersApi('supplier', supplierId),
          getProductsApi('supplier', supplierId)
        ]);
        setOrders(ord);
        setProducts(prod);
      } catch (err: any) {
        setError(err.message || 'Failed to load supplier dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [supplierId]);

  if (loading) return <LoadingSpinner label="Loading supplier dashboard metrics..." />;
  if (error) return <ErrorMessage message={error} />;

  // Calculate metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));

  let totalSales = 0;
  orders.forEach(ord => {
    ord.items.forEach(item => {
      // Calculate revenue specifically for this supplier's products
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        totalSales += item.totalPrice;
      }
    });
  });

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-blue-950/40 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-300 flex items-center justify-between">
        <div>
          <p className="font-bold text-blue-200">Supplier Access Mode Active</p>
          <p className="text-[11px] text-blue-400 mt-0.5">
            You are viewing data restricted exclusively to your company's product inventory and client sales.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Orders
            </span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
            {todayOrders.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total overall orders: <span className="font-semibold">{orders.length}</span>
          </p>
        </div>

        {/* Total Sales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            PKR {totalSales.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {products.length} catalog products
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Low-Stock Alerts
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400">
            {lowStockProducts.length} Items
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requires inventory restock
          </p>
        </div>
      </div>

      {/* Low Stock Warning List */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Stock Warning Attention Needed
          </h3>
          <div className="space-y-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                    Only {p.stock} left in stock (Threshold: {p.lowStockThreshold})
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('products')}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Update Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-blue-500" />
            <span>Recent Orders Containing Your Items</span>
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All Orders
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No recent orders found.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map(ord => (
              <div key={ord.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{ord.orderNumber}</span>
                    <span className="text-slate-500 font-medium">{ord.clientShop}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {ord.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    PKR {ord.totalAmount.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-300">
                    {ord.status}
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
