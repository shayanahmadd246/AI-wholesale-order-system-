import { Product, Role } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_PRODUCTS } from './mockData';

// Helper to sanitize sensitive cost & profit data for non-admins
const sanitizeForRole = (products: Product[], role: Role): Product[] => {
  if (role === 'admin') return products; // Admin sees everything including costPrice!
  return products.map(p => ({
    ...p,
    costPrice: 0 // Explicitly strip cost price for clients and suppliers!
  }));
};

export const getProductsApi = async (role: Role, supplierId?: string): Promise<Product[]> => {
  await new Promise(res => setTimeout(res, 250));
  let products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);

  if (role === 'supplier' && supplierId) {
    products = products.filter(p => p.supplierId === supplierId);
  }

  return sanitizeForRole(products, role);
};

export const getProductByIdApi = async (id: string, role: Role): Promise<Product | null> => {
  await new Promise(res => setTimeout(res, 150));
  const products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const found = products.find(p => p.id === id);
  if (!found) return null;
  return sanitizeForRole([found], role)[0];
};

export const addProductApi = async (productData: Omit<Product, 'id'>, role: Role): Promise<Product> => {
  await new Promise(res => setTimeout(res, 300));
  const products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`
  };
  products.unshift(newProduct);
  setStored(KEYS.PRODUCTS, products);
  return sanitizeForRole([newProduct], role)[0];
};

export const updateProductApi = async (id: string, updates: Partial<Product>, role: Role): Promise<Product> => {
  await new Promise(res => setTimeout(res, 300));
  const products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Product not found');

  // Preserve cost price if non-admin attempts edit
  if (role !== 'admin') {
    delete updates.costPrice;
  }

  products[idx] = { ...products[idx], ...updates };
  setStored(KEYS.PRODUCTS, products);
  return sanitizeForRole([products[idx]], role)[0];
};

export const updateStockAndPriceApi = async (
  id: string,
  stock: number,
  wholesalePrice?: number,
  costPrice?: number,
  role: Role = 'admin'
): Promise<Product> => {
  await new Promise(res => setTimeout(res, 250));
  const products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Product not found');

  products[idx].stock = stock;
  if (wholesalePrice !== undefined) products[idx].wholesalePrice = wholesalePrice;
  if (costPrice !== undefined && role === 'admin') products[idx].costPrice = costPrice;

  setStored(KEYS.PRODUCTS, products);
  return sanitizeForRole([products[idx]], role)[0];
};

export const deleteProductApi = async (id: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 250));
  let products = getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  products = products.filter(p => p.id !== id);
  setStored(KEYS.PRODUCTS, products);
};
