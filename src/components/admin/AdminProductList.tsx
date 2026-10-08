import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { getProductsApi, updateStockAndPriceApi, addProductApi, deleteProductApi } from '../../api/products';
import { getSuppliersApi } from '../../api/suppliers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Package, Edit3, Trash2, Save, Plus, TrendingUp } from 'lucide-react';

export const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [wholesaleInput, setWholesaleInput] = useState<number>(0);
  const [costInput, setCostInput] = useState<number>(0);

  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; stock: number; wholesale: number; cost: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, sups] = await Promise.all([
        getProductsApi('admin'),
        getSuppliersApi()
      ]);
      setProducts(prods);
      setSuppliers(sups);
    } catch (err: any) {
      setError(err.message || 'Failed to load master inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setStockInput(p.stock);
    setWholesaleInput(p.wholesalePrice);
    setCostInput(p.costPrice);
  };

  const handleRequestSave = (p: Product) => {
    setConfirmTarget({
      id: p.id,
      name: p.name,
      stock: stockInput,
      wholesale: wholesaleInput,
      cost: costInput
    });
  };

  const handleExecuteSave = async () => {
    if (!confirmTarget) return;
    setIsSaving(true);
    try {
      await updateStockAndPriceApi(confirmTarget.id, confirmTarget.stock, confirmTarget.wholesale, confirmTarget.cost, 'admin');
      await fetchCatalog();
      setEditingId(null);
      setConfirmTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteProductApi(deleteTarget.id);
      await fetchCatalog();
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            <span>All Products & Margin Analysis</span>
          </h2>
          <p className="text-xs text-slate-500">
            Wholesaler Master View: Cost prices and per-item profit margins unlocked.
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner label="Loading master product inventory & margins..." />}
      {error && <ErrorMessage message={error} onRetry={fetchCatalog} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState title="No Inventory Items Found" description="Add your first wholesale product." />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5 text-right">Cost Price (PKR)</th>
                  <th className="p-3.5 text-right">Wholesale Price (PKR)</th>
                  <th className="p-3.5 text-right">Profit / Item</th>
                  <th className="p-3.5 text-right">Stock</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const isEditing = editingId === p.id;
                  const currentCost = isEditing ? costInput : p.costPrice;
                  const currentSell = isEditing ? wholesaleInput : p.wholesalePrice;
                  const profitMargin = Math.max(0, currentSell - currentCost);
                  const marginPercent = currentSell > 0 ? ((profitMargin / currentSell) * 100).toFixed(1) : '0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs">
                        {p.name}
                        <p className="text-[11px] font-normal text-slate-400">{p.unit}</p>
                      </td>
                      <td className="p-3.5 text-slate-500">{p.supplierName}</td>

                      {/* Cost Price */}
                      <td className="p-3.5 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={costInput}
                            onChange={e => setCostInput(parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded text-right font-bold"
                          />
                        ) : (
                          <span className="text-slate-400 font-medium">
                            PKR {p.costPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Wholesale Selling Price */}
                      <td className="p-3.5 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={wholesaleInput}
                            onChange={e => setWholesaleInput(parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded text-right font-bold"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            PKR {p.wholesalePrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Profit Margin (Admin Exclusive) */}
                      <td className="p-3.5 text-right font-mono">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +PKR {profitMargin.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-slate-400">({marginPercent}%)</span>
                      </td>

                      {/* Stock */}
                      <td className="p-3.5 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={stockInput}
                            onChange={e => setStockInput(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded text-right font-bold"
                          />
                        ) : (
                          <span className={`font-bold ${p.stock <= p.lowStockThreshold ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {p.stock}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleRequestSave(p)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs"
                              title="Cancel"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                              title="Edit Stock & Pricing"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Confirm Pricing & Stock Change"
        description={`Are you sure you want to update financials for "${confirmTarget?.name}"?`}
        highlightText={`Stock: ${confirmTarget?.stock} | Cost: PKR ${confirmTarget?.cost} | Selling: PKR ${confirmTarget?.wholesale}`}
        confirmLabel="Yes, Save Financials"
        variant="primary"
        isLoading={isSaving}
        onConfirm={handleExecuteSave}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Product from Inventory"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"?`}
        confirmLabel="Yes, Delete Item"
        variant="danger"
        isLoading={isSaving}
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
