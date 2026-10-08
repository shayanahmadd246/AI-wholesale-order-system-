import { Product, Client, Supplier, Order, PaymentRecord, AIActivityLog, ChatMessage, AdminUser } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CLIENTS,
  INITIAL_SUPPLIERS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_AI_LOGS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ADMINS
} from './mockData';

const KEYS = {
  USER: 'awos_user',
  ADMINS: 'awos_admins',
  PRODUCTS: 'awos_products',
  CLIENTS: 'awos_clients',
  SUPPLIERS: 'awos_suppliers',
  ORDERS: 'awos_orders',
  PAYMENTS: 'awos_payments',
  AI_LOGS: 'awos_ai_logs',
  CHAT: 'awos_chat_messages'
};

export const getStored = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage`, err);
    return fallback;
  }
};

export const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage`, err);
  }
};

// Initialize Storage with defaults if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.ADMINS)) setStored(KEYS.ADMINS, INITIAL_ADMINS);
  if (!localStorage.getItem(KEYS.PRODUCTS)) setStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!localStorage.getItem(KEYS.CLIENTS)) setStored(KEYS.CLIENTS, INITIAL_CLIENTS);
  if (!localStorage.getItem(KEYS.SUPPLIERS)) setStored(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  if (!localStorage.getItem(KEYS.ORDERS)) setStored(KEYS.ORDERS, INITIAL_ORDERS);
  if (!localStorage.getItem(KEYS.PAYMENTS)) setStored(KEYS.PAYMENTS, INITIAL_PAYMENTS);
  if (!localStorage.getItem(KEYS.AI_LOGS)) setStored(KEYS.AI_LOGS, INITIAL_AI_LOGS);
  if (!localStorage.getItem(KEYS.CHAT)) setStored(KEYS.CHAT, INITIAL_CHAT_MESSAGES);
};

export { KEYS };
