import { Supplier, SupplierPermissions } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_SUPPLIERS } from './mockData';

export const getSuppliersApi = async (): Promise<Supplier[]> => {
  await new Promise(res => setTimeout(res, 250));
  return getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
};

export const getSupplierByIdApi = async (id: string): Promise<Supplier | null> => {
  await new Promise(res => setTimeout(res, 150));
  const suppliers = getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  return suppliers.find(s => s.id === id) || null;
};

export const addSupplierApi = async (supplierData: Omit<Supplier, 'id' | 'totalSales' | 'pendingPayout'>): Promise<Supplier> => {
  await new Promise(res => setTimeout(res, 300));
  const suppliers = getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  const newSupplier: Supplier = {
    ...supplierData,
    id: `sup-${Date.now()}`,
    totalSales: 0,
    pendingPayout: 0
  };
  suppliers.unshift(newSupplier);
  setStored(KEYS.SUPPLIERS, suppliers);
  return newSupplier;
};

export const updateSupplierPermissionsApi = async (
  id: string,
  permissions: SupplierPermissions
): Promise<Supplier> => {
  await new Promise(res => setTimeout(res, 250));
  const suppliers = getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Supplier not found');

  suppliers[idx].permissions = permissions;
  setStored(KEYS.SUPPLIERS, suppliers);
  return suppliers[idx];
};

export const updateSupplierApi = async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
  await new Promise(res => setTimeout(res, 300));
  const suppliers = getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Supplier not found');

  suppliers[idx] = { ...suppliers[idx], ...updates };
  setStored(KEYS.SUPPLIERS, suppliers);
  return suppliers[idx];
};

export const deleteSupplierApi = async (id: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 250));
  let suppliers = getStored<Supplier[]>(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  suppliers = suppliers.filter(s => s.id !== id);
  setStored(KEYS.SUPPLIERS, suppliers);
};
