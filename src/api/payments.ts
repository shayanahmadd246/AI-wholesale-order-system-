import { PaymentRecord, Role } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_PAYMENTS, INITIAL_CLIENTS, INITIAL_SUPPLIERS } from './mockData';

export const getPaymentsApi = async (role: Role, partyId?: string): Promise<PaymentRecord[]> => {
  await new Promise(res => setTimeout(res, 250));
  let payments = getStored<PaymentRecord[]>(KEYS.PAYMENTS, INITIAL_PAYMENTS);

  if (role === 'client' && partyId) {
    payments = payments.filter(p => p.partyId === partyId);
  } else if (role === 'supplier' && partyId) {
    payments = payments.filter(p => p.partyId === partyId);
  }

  return payments;
};

export const recordPaymentApi = async (
  paymentData: Omit<PaymentRecord, 'id' | 'date' | 'status'>
): Promise<PaymentRecord> => {
  await new Promise(res => setTimeout(res, 300));
  const payments = getStored<PaymentRecord[]>(KEYS.PAYMENTS, INITIAL_PAYMENTS);

  const newPayment: PaymentRecord = {
    ...paymentData,
    id: `pay-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  };

  payments.unshift(newPayment);
  setStored(KEYS.PAYMENTS, payments);

  // If client payment, reduce client's totalDues
  if (paymentData.partyRole === 'client') {
    const clients = getStored(KEYS.CLIENTS, INITIAL_CLIENTS);
    const client = clients.find(c => c.id === paymentData.partyId);
    if (client) {
      client.totalDues = Math.max(0, client.totalDues - paymentData.amount);
      setStored(KEYS.CLIENTS, clients);
    }
  } else if (paymentData.partyRole === 'supplier') {
    const suppliers = getStored(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    const supplier = suppliers.find(s => s.id === paymentData.partyId);
    if (supplier) {
      supplier.pendingPayout = Math.max(0, supplier.pendingPayout - paymentData.amount);
      setStored(KEYS.SUPPLIERS, suppliers);
    }
  }

  return newPayment;
};
