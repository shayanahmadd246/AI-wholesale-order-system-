import { AIActivityLog, Role, SalesReportFilter, Language } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_AI_LOGS, INITIAL_ORDERS, INITIAL_PRODUCTS } from './mockData';

export const logAIActivityApi = async (
  action: string,
  actor: string,
  role: Role | 'system',
  details: string,
  language?: Language
): Promise<void> => {
  const logs = getStored<AIActivityLog[]>(KEYS.AI_LOGS, INITIAL_AI_LOGS);
  const now = new Date();
  const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  logs.unshift({
    id: `log-${Date.now()}`,
    action,
    actor,
    role,
    details,
    timestamp: timeStr,
    language
  });

  setStored(KEYS.AI_LOGS, logs);
};

export const getAIActivityLogsApi = async (): Promise<AIActivityLog[]> => {
  await new Promise(res => setTimeout(res, 200));
  return getStored<AIActivityLog[]>(KEYS.AI_LOGS, INITIAL_AI_LOGS);
};

export interface SalesReportSummary {
  totalRevenue: number;
  totalCost: number;     // Admin ONLY
  totalProfit: number;   // Admin ONLY
  profitMarginPercent: number; // Admin ONLY
  totalOrdersCount: number;
  averageOrderValue: number;
  topSellingProducts: Array<{ name: string; quantity: number; revenue: number }>;
  salesByDay: Array<{ date: string; sales: number; profit: number }>;
}

export const getSalesReportApi = async (
  role: Role,
  filter?: SalesReportFilter
): Promise<SalesReportSummary> => {
  await new Promise(res => setTimeout(res, 300));
  const orders = getStored(KEYS.ORDERS, INITIAL_ORDERS);

  let filteredOrders = orders.filter(o => o.status !== 'Cancelled');

  if (filter?.supplierId) {
    filteredOrders = filteredOrders.filter(o => o.supplierIds.includes(filter.supplierId!));
  }
  if (filter?.clientId) {
    filteredOrders = filteredOrders.filter(o => o.clientId === filter.clientId);
  }

  let totalRevenue = 0;
  let totalCost = 0;

  const productTotalsMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  const salesByDayMap: Record<string, { sales: number; profit: number }> = {};

  filteredOrders.forEach(ord => {
    totalRevenue += ord.totalAmount;

    const dateKey = ord.createdAt.split('T')[0] || '2026-10-07';
    if (!salesByDayMap[dateKey]) {
      salesByDayMap[dateKey] = { sales: 0, profit: 0 };
    }
    salesByDayMap[dateKey].sales += ord.totalAmount;

    ord.items.forEach(item => {
      const itemCost = item.unitCost * item.quantity;
      totalCost += itemCost;
      const itemProfit = item.totalPrice - itemCost;
      salesByDayMap[dateKey].profit += itemProfit;

      if (!productTotalsMap[item.productId]) {
        productTotalsMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productTotalsMap[item.productId].quantity += item.quantity;
      productTotalsMap[item.productId].revenue += item.totalPrice;
    });
  });

  const totalProfit = Math.max(0, totalRevenue - totalCost);
  const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const totalOrdersCount = filteredOrders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  const topSellingProducts = Object.values(productTotalsMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const salesByDay = Object.entries(salesByDayMap)
    .map(([date, val]) => ({ date, sales: val.sales, profit: val.profit }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Sanitize profit/cost for non-admins
  if (role !== 'admin') {
    return {
      totalRevenue,
      totalCost: 0,
      totalProfit: 0,
      profitMarginPercent: 0,
      totalOrdersCount,
      averageOrderValue,
      topSellingProducts,
      salesByDay: salesByDay.map(d => ({ date: d.date, sales: d.sales, profit: 0 }))
    };
  }

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    profitMarginPercent,
    totalOrdersCount,
    averageOrderValue,
    topSellingProducts,
    salesByDay
  };
};
