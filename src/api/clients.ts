import { Client, Role } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_CLIENTS, INITIAL_ORDERS } from './mockData';

export const getClientsApi = async (role: Role, supplierId?: string): Promise<Client[]> => {
  await new Promise(res => setTimeout(res, 250));
  let clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);

  if (role === 'supplier' && supplierId) {
    // A supplier sees clients who have bought their products
    const orders = getStored(KEYS.ORDERS, INITIAL_ORDERS);
    const supplierOrders = orders.filter(o => o.supplierIds.includes(supplierId));
    const clientIds = new Set(supplierOrders.map(o => o.clientId));
    clients = clients.filter(c => clientIds.has(c.id));
  }

  return clients;
};

export const getClientByIdApi = async (id: string): Promise<Client | null> => {
  await new Promise(res => setTimeout(res, 150));
  const clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);
  return clients.find(c => c.id === id) || null;
};

export const addClientApi = async (clientData: Omit<Client, 'id' | 'joinedDate' | 'totalDues'>): Promise<Client> => {
  await new Promise(res => setTimeout(res, 300));
  const clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);
  const newClient: Client = {
    ...clientData,
    id: `cli-${Date.now()}`,
    totalDues: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  clients.unshift(newClient);
  setStored(KEYS.CLIENTS, clients);
  return newClient;
};

export const updateClientApi = async (id: string, updates: Partial<Client>): Promise<Client> => {
  await new Promise(res => setTimeout(res, 300));
  const clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) throw new Error('Client not found');

  clients[idx] = { ...clients[idx], ...updates };
  setStored(KEYS.CLIENTS, clients);
  return clients[idx];
};

export const toggleBlockClientApi = async (id: string): Promise<Client> => {
  await new Promise(res => setTimeout(res, 250));
  const clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) throw new Error('Client not found');

  clients[idx].status = clients[idx].status === 'Active' ? 'Blocked' : 'Active';
  setStored(KEYS.CLIENTS, clients);
  return clients[idx];
};
