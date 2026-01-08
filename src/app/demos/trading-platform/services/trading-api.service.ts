import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TradingOrder {
  id: string;
  symbol: string;
  orderType: 'Market' | 'Limit' | 'Stop';
  side: 'Buy' | 'Sell';
  quantity: number;
  filledQty: number;
  avgPrice: number;
  limitPrice?: number;
  status: 'Filled' | 'Partial' | 'Pending' | 'Cancelled';
  pnl: number;
  commission: number;
  createdAt: string;
  trader: string;
}

export interface TradingOrdersResponse {
  data: TradingOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TradingOrdersRequest {
  page: number;
  pageSize: number;
  search?: string;
  orderType?: string;
  side?: string;
  status?: string;
}

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD', 'NFLX', 'JPM', 'V', 'MA', 'DIS', 'PYPL', 'INTC'];
const TRADERS = [
  'James Chen', 'Sarah Kim', 'Michael Ross', 'Emily Zhang', 'David Park',
  'Jessica Liu', 'Robert Yang', 'Amanda Wu', 'Christopher Lee', 'Nicole Wang'
];

function generateMockOrders(): TradingOrder[] {
  const orders: TradingOrder[] = [];
  const orderTypes: TradingOrder['orderType'][] = ['Market', 'Limit', 'Stop'];
  const sides: TradingOrder['side'][] = ['Buy', 'Sell'];
  const statuses: TradingOrder['status'][] = ['Filled', 'Partial', 'Pending', 'Cancelled'];

  for (let i = 1; i <= 58; i++) {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = Math.floor(Math.random() * 500 + 10) * 10;
    
    let filledQty = 0;
    if (status === 'Filled') filledQty = quantity;
    else if (status === 'Partial') filledQty = Math.floor(quantity * (0.2 + Math.random() * 0.6));
    else if (status === 'Pending') filledQty = 0;
    else filledQty = Math.floor(quantity * Math.random() * 0.3);

    const basePrice = 50 + Math.random() * 400;
    const avgPrice = Math.round(basePrice * 100) / 100;
    const limitPrice = orderType !== 'Market' ? Math.round((basePrice * (0.95 + Math.random() * 0.1)) * 100) / 100 : undefined;
    
    const pnl = status === 'Filled' || status === 'Partial' 
      ? Math.round((Math.random() * 30 - 10) * 10) / 10 
      : 0;
    
    const commission = Math.round((quantity * 0.01 + Math.random() * 5) * 100) / 100;
    
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
    
    orders.push({
      id: `ORD-${String(i).padStart(4, '0')}`,
      symbol,
      orderType,
      side,
      quantity,
      filledQty,
      avgPrice,
      limitPrice,
      status,
      pnl,
      commission,
      createdAt: date.toISOString(),
      trader: TRADERS[Math.floor(Math.random() * TRADERS.length)],
    });
  }

  // Sort by date descending (most recent first)
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

@Injectable({
  providedIn: 'root',
})
export class TradingApiService {
  private mockOrders = generateMockOrders();

  getOrders(request: TradingOrdersRequest): Observable<TradingOrdersResponse> {
    let filtered = [...this.mockOrders];

    // Search filter
    if (request.search) {
      const searchLower = request.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.symbol.toLowerCase().includes(searchLower) ||
          order.trader.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
      );
    }

    // Order type filter
    if (request.orderType && request.orderType !== 'All') {
      filtered = filtered.filter((order) => order.orderType === request.orderType);
    }

    // Side filter
    if (request.side && request.side !== 'All') {
      filtered = filtered.filter((order) => order.side === request.side);
    }

    // Status filter
    if (request.status && request.status !== 'All') {
      filtered = filtered.filter((order) => order.status === request.status);
    }

    const total = filtered.length;
    const start = (request.page - 1) * request.pageSize;
    const data = filtered.slice(start, start + request.pageSize);

    // Simulate network delay (300-600ms)
    const networkDelay = 300 + Math.random() * 300;

    return of({
      data,
      total,
      page: request.page,
      pageSize: request.pageSize,
    }).pipe(delay(networkDelay));
  }
}
