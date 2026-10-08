import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { getProductsApi, addProductApi, updateStockAndPriceApi } from '../../api/products';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmModal } from '../common/ConfirmModal';
import { Package, Plus, Edit3, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

interface SupplierProductListProps {
  supplierId: string;
  supplierName: string;
}

export const SupplierProductList: React.FC<SupplierProductListProps> = ({ supplierId, supplierName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Inline Edit Stock & Price State
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [priceInput, setPriceInput] = useState<number>(0);

  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name: string; newStock: number; newPrice: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Grains & Pulses');
  const [newUnit, setNewUnit] = useState('Bag (50kg)');
  const [newPrice, setNewPrice] = useState<number>(1000);
  const [newStock, setNewStock] = useState<number>(50);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsApi('supplier', supplierId);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load supplier products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [supplierId]);

  const handleStartEdit = (p: Product) => {
    setEditingProdId(p.id);
    setStockInput(p.stock);
    setPriceInput(p.wholesalePrice);
  };

  const handleRequestSave = (p: Product) => {
    setConfirmTarget({
      id: p.id,
      name: p.name,
      newStock: stockInput,
      newPrice: priceInput
    });
  };

  const handleExecuteSave = async () => {
    if (!confirmTarget) return;
    setIsSaving(true);
    try {
      await updateStockAndPriceApi(confirmTarget.id, confirmTarget.newStock, confirmTarget.newPrice, undefined, 'supplier');
      await fetchProducts();
      setEditingProdId(null);
      setConfirmTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update product stock/price');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addProductApi(
        {
          name: newName,
          supplierId,
          supplierName,
          category: newCategory,
          unit: newUnit,
          wholesalePrice: newPrice,
          costPrice: 0, // Cost price strictly hidden from supplier!
          stock: newStock,
          minOrderQty: 1,
          lowStockThreshold: 10,
          description: 'Added by supplier'
        },
        'supplier'
      );
      await fetchProducts();
      setShowAddModal(false);
      setNewName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span>My Product Inventory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage your company stock levels and wholesale prices in real time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {loading && <LoadingSpinner label="Fetching your product catalog..." />}
      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No Products Found"
          description="You haven't added any products to your catalog yet."
          actionLabel="Add Your First Product"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Unit Packaging</th>
                  <th className="p-3.5 text-right">Wholesale Price (PKR)</th>
                  <th className="p-3.5 text-right">Available Stock</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const isEditing = editingProdId === p.id;
                  const isLow = p.stock <= p.lowStockThreshold;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs">
                        {p.name}
                        {isLow && (
                          <span className="ml-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Low Stock ({p.stock})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">{p.category}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{p.unit}</td>

                      <td className="p-3.5 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={priceInput}
                            onChange={e => setPriceInput(parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-blue-500 rounded text-right font-bold text-slate-900 dark:text-white"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            PKR {p.wholesalePrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={stockInput}
                            onChange={e => setStockInput(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-blue-500 rounded text-right font-bold text-slate-900 dark:text-white"
                          />
                        ) : (
                          <span className={`font-bold ${isLow ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {p.stock} units
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleRequestSave(p)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                            <button
                              onClick={() => setEditingProdId(null)}
                              className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 mx-auto"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Supplier Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Fine Wheat Flour 20kg"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    placeholder="e.g. 20kg Bag"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wholesale Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
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
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Price / Stock Change */}
      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Confirm Inventory Update"
        description={`Are you sure you want to update stock and price for "${confirmTarget?.name}"?`}
        highlightText={`Stock: ${confirmTarget?.newStock} units | Price: PKR ${confirmTarget?.newPrice.toLocaleString()}`}
        confirmLabel="Yes, Update Inventory"
        variant="warning"
        isLoading={isSaving}
        onConfirm={handleExecuteSave}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};
