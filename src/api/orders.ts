import { Order, OrderStatus, Role } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_CLIENTS } from './mockData';

// Helper to sanitize cost info from order items for non-admins
const sanitizeOrderForRole = (orders: Order[], role: Role): Order[] => {
  if (role === 'admin') return orders;
  return orders.map(ord => ({
    ...ord,
    items: ord.items.map(item => ({
      ...item,
      unitCost: 0 // Hide unit cost from clients and suppliers!
    }))
  }));
};

export const getOrdersApi = async (role: Role, userId?: string): Promise<Order[]> => {
  await new Promise(res => setTimeout(res, 250));
  let orders = getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);

  if (role === 'client' && userId) {
    orders = orders.filter(o => o.clientId === userId);
  } else if (role === 'supplier' && userId) {
    orders = orders.filter(o => o.supplierIds.includes(userId));
  }

  return sanitizeOrderForRole(orders, role);
};

export const getOrderByIdApi = async (id: string, role: Role): Promise<Order | null> => {
  await new Promise(res => setTimeout(res, 150));
  const orders = getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  const found = orders.find(o => o.id === id);
  if (!found) return null;
  return sanitizeOrderForRole([found], role)[0];
};

export const createOrderApi = async (
  clientId: string,
  items: Array<{ productId: string; quantity: number }>,
  deliveryAddress?: string,
  notes?: string
): Promise<Order> => {
  await new Promise(res => setTimeout(res, 350));
  const orders = getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  const products = getStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const clients = getStored(KEYS.CLIENTS, INITIAL_CLIENTS);

  const client = clients.find(c => c.id === clientId) || clients[0];

  const orderItems = [];
  let totalAmount = 0;
  const supplierIdsSet = new Set<string>();

  for (const item of items) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) continue;

    const lineTotal = prod.wholesalePrice * item.quantity;
    totalAmount += lineTotal;
    supplierIdsSet.add(prod.supplierId);

    // Deduct stock
    prod.stock = Math.max(0, prod.stock - item.quantity);

    orderItems.push({
      productId: prod.id,
      productName: prod.name,
      quantity: item.quantity,
      unit: prod.unit,
      unitPrice: prod.wholesalePrice,
      unitCost: prod.costPrice,
      totalPrice: lineTotal
    });
  }

  // Save updated product stocks
  setStored(KEYS.PRODUCTS, products);

  // Update client dues
  client.totalDues += totalAmount;
  setStored(KEYS.CLIENTS, clients);

  const newOrderNumber = `ORD-${1000 + orders.length + 1}`;
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: newOrderNumber,
    clientId: client.id,
    clientName: client.name,
    clientShop: client.shopName,
    clientPhone: client.phone,
    status: 'Placed',
    items: orderItems,
    totalAmount,
    supplierIds: Array.from(supplierIdsSet),
    createdAt: new Date().toISOString(),
    deliveryAddress: deliveryAddress || client.address,
    paymentStatus: 'Unpaid',
    notes
  };

  orders.unshift(newOrder);
  setStored(KEYS.ORDERS, orders);

  return newOrder;
};

export const updateOrderStatusApi = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  await new Promise(res => setTimeout(res, 250));
  const orders = getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) throw new Error('Order not found');

  orders[idx].status = status;
  if (status === 'Delivered') {
    orders[idx].paymentStatus = 'Paid';
  }

  setStored(KEYS.ORDERS, orders);
  return orders[idx];
};

export const reorderPreviousOrderApi = async (orderId: string): Promise<Order> => {
  const orders = getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  const existing = orders.find(o => o.id === orderId);
  if (!existing) throw new Error('Order not found');

  const items = existing.items.map(i => ({
    productId: i.productId,
    quantity: i.quantity
  }));

  return createOrderApi(existing.clientId, items, existing.deliveryAddress, `Reorder of ${existing.orderNumber}`);
};
