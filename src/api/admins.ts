import { AdminUser } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_ADMINS } from './mockData';

export const getAdminsApi = async (): Promise<AdminUser[]> => {
  await new Promise(res => setTimeout(res, 200));
  return getStored<AdminUser[]>(KEYS.ADMINS, INITIAL_ADMINS);
};

export const addAdminApi = async (data: Omit<AdminUser, 'id' | 'role' | 'createdDate'>): Promise<AdminUser> => {
  await new Promise(res => setTimeout(res, 300));
  const admins = getStored<AdminUser[]>(KEYS.ADMINS, INITIAL_ADMINS);
  const newAdmin: AdminUser = {
    ...data,
    id: `admin-${Date.now()}`,
    role: 'admin',
    createdDate: new Date().toISOString().split('T')[0]
  };
  admins.unshift(newAdmin);
  setStored(KEYS.ADMINS, admins);
  return newAdmin;
};

export const toggleAdminStatusApi = async (id: string): Promise<AdminUser> => {
  await new Promise(res => setTimeout(res, 200));
  const admins = getStored<AdminUser[]>(KEYS.ADMINS, INITIAL_ADMINS);
  const idx = admins.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Admin not found');

  admins[idx].status = admins[idx].status === 'Active' ? 'Inactive' : 'Active';
  setStored(KEYS.ADMINS, admins);
  return admins[idx];
};

export const deleteAdminApi = async (id: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 200));
  let admins = getStored<AdminUser[]>(KEYS.ADMINS, INITIAL_ADMINS);
  admins = admins.filter(a => a.id !== id);
  setStored(KEYS.ADMINS, admins);
};
