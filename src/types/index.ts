export type Role = 'client' | 'supplier' | 'admin';

export type Language = 'en' | 'ur' | 'ps';

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  cnicNumber?: string;
  email?: string;
  shopName?: string;
  companyName?: string;
  language?: Language;
  supplierId?: string;
  clientId?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin';
  status: 'Active' | 'Inactive';
  createdDate: string;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  namePashto?: string;
  supplierId: string;
  supplierName: string;
  category: string;
  unit: string;
  wholesalePrice: number;
  costPrice: number;
  stock: number;
  minOrderQty: number;
  lowStockThreshold: number;
  image?: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  unitCost: number;
  totalPrice: number;
}

export type OrderStatus = 'Placed' | 'Accepted' | 'Packed' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientShop: string;
  clientPhone: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  supplierIds: string[];
  createdAt: string;
  deliveryAddress: string;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  cnicNumber?: string;
  password?: string;
  city: string;
  address: string;
  language: Language;
  totalDues: number;
  creditLimit: number;
  status: 'Active' | 'Blocked';
  joinedDate: string;
}

export interface SupplierPermissions {
  canChangePrices: boolean;
  canChangeStock: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  password?: string;
  category: string;
  status: 'Active' | 'Inactive';
  permissions: SupplierPermissions;
  totalSales: number;
  pendingPayout: number;
  hiredDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  type: 'text' | 'voice' | 'order_card';
  content: string;
  audioUrl?: string;
  voiceDuration?: number;
  transcription?: string;
  orderDraft?: {
    id?: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress?: string;
    confirmed?: boolean;
  };
  timestamp: string;
  language?: Language;
}

export interface PaymentRecord {
  id: string;
  partyId: string;
  partyName: string;
  partyRole: 'client' | 'supplier';
  type: 'ClientPayment' | 'SupplierPayout';
  amount: number;
  method: 'Bank Transfer' | 'Cash' | 'Cheque' | 'Mobile Wallet';
  reference: string;
  date: string;
  status: 'Completed' | 'Pending';
  notes?: string;
  receiptUrl?: string;
}

export interface AIActivityLog {
  id: string;
  action: string;
  actor: string;
  role: Role | 'system';
  details: string;
  timestamp: string;
  language?: Language;
}

export interface SalesReportFilter {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  clientId?: string;
}
