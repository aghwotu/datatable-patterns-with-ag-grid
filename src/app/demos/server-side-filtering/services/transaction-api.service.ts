import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  status: 'Cleared' | 'Pending' | 'Declined';
  cardLast4: string;
}

export interface TransactionQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filterStatus?: string;
  filterCategory?: string;
  searchTerm?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Large dataset - 100 transactions
const allTransactions: Transaction[] = [
  { id: 'TXN001', date: '2026-01-08', description: 'Office Supplies Purchase', merchant: 'Staples', category: 'Office', amount: -234.56, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN002', date: '2026-01-08', description: 'Team Lunch Meeting', merchant: 'Chipotle', category: 'Meals', amount: -87.50, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN003', date: '2026-01-08', description: 'Cloud Hosting - January', merchant: 'AWS', category: 'Software', amount: -1249.99, status: 'Pending', cardLast4: '8832' },
  { id: 'TXN004', date: '2026-01-07', description: 'Flight to NYC', merchant: 'Delta Airlines', category: 'Travel', amount: -542.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN005', date: '2026-01-07', description: 'Hotel Reservation', merchant: 'Marriott', category: 'Travel', amount: -389.00, status: 'Pending', cardLast4: '4521' },
  { id: 'TXN006', date: '2026-01-07', description: 'Uber to Airport', merchant: 'Uber', category: 'Travel', amount: -45.23, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN007', date: '2026-01-06', description: 'Software License Renewal', merchant: 'Adobe', category: 'Software', amount: -599.88, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN008', date: '2026-01-06', description: 'Team Snacks', merchant: 'Costco', category: 'Office', amount: -156.78, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN009', date: '2026-01-06', description: 'Conference Registration', merchant: 'TechConf 2026', category: 'Training', amount: -899.00, status: 'Declined', cardLast4: '4521' },
  { id: 'TXN010', date: '2026-01-05', description: 'Client Dinner', merchant: 'The Capital Grille', category: 'Meals', amount: -312.45, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN011', date: '2026-01-05', description: 'Parking - Downtown', merchant: 'City Parking', category: 'Travel', amount: -25.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN012', date: '2026-01-05', description: 'GitHub Enterprise', merchant: 'GitHub', category: 'Software', amount: -210.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN013', date: '2026-01-04', description: 'Office Furniture', merchant: 'IKEA', category: 'Office', amount: -1456.00, status: 'Pending', cardLast4: '4521' },
  { id: 'TXN014', date: '2026-01-04', description: 'Coffee Meeting', merchant: 'Starbucks', category: 'Meals', amount: -24.50, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN015', date: '2026-01-04', description: 'Online Course', merchant: 'Udemy', category: 'Training', amount: -149.99, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN016', date: '2026-01-03', description: 'Taxi from Airport', merchant: 'Yellow Cab', category: 'Travel', amount: -67.80, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN017', date: '2026-01-03', description: 'Slack Subscription', merchant: 'Slack', category: 'Software', amount: -125.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN018', date: '2026-01-03', description: 'Office Plants', merchant: 'Home Depot', category: 'Office', amount: -89.99, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN019', date: '2026-01-02', description: 'Team Building Event', merchant: 'Escape Room NYC', category: 'Training', amount: -450.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN020', date: '2026-01-02', description: 'Lunch with Investor', merchant: 'Nobu', category: 'Meals', amount: -478.90, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN021', date: '2026-01-02', description: 'Domain Renewal', merchant: 'GoDaddy', category: 'Software', amount: -45.99, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN022', date: '2026-01-01', description: 'New Year Office Party', merchant: 'Party City', category: 'Office', amount: -234.50, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN023', date: '2026-01-01', description: 'Catering Service', merchant: 'Local Catering Co', category: 'Meals', amount: -1250.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN024', date: '2025-12-31', description: 'Year-End Bonus Dinner', merchant: 'Ruth\'s Chris', category: 'Meals', amount: -890.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN025', date: '2025-12-31', description: 'SSL Certificate', merchant: 'DigiCert', category: 'Software', amount: -299.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN026', date: '2025-12-30', description: 'Office Cleaning', merchant: 'CleanPro Services', category: 'Office', amount: -175.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN027', date: '2025-12-30', description: 'Train Tickets', merchant: 'Amtrak', category: 'Travel', amount: -156.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN028', date: '2025-12-29', description: 'Conference Booth', merchant: 'CES 2026', category: 'Marketing', amount: -5000.00, status: 'Pending', cardLast4: '8832' },
  { id: 'TXN029', date: '2025-12-29', description: 'Marketing Swag', merchant: 'Custom Ink', category: 'Marketing', amount: -1234.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN030', date: '2025-12-28', description: 'Zoom Subscription', merchant: 'Zoom', category: 'Software', amount: -199.90, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN031', date: '2025-12-28', description: 'Office Snacks Delivery', merchant: 'Snack Nation', category: 'Office', amount: -299.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN032', date: '2025-12-27', description: 'Client Gift Basket', merchant: 'Harry & David', category: 'Marketing', amount: -175.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN033', date: '2025-12-27', description: 'Rental Car', merchant: 'Enterprise', category: 'Travel', amount: -287.50, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN034', date: '2025-12-26', description: 'LinkedIn Premium', merchant: 'LinkedIn', category: 'Software', amount: -59.99, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN035', date: '2025-12-26', description: 'Team Breakfast', merchant: 'IHOP', category: 'Meals', amount: -134.25, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN036', date: '2025-12-25', description: 'Holiday Bonus Cards', merchant: 'Amazon', category: 'Office', amount: -2500.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN037', date: '2025-12-24', description: 'Office Decorations', merchant: 'Target', category: 'Office', amount: -189.99, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN038', date: '2025-12-24', description: 'Google Workspace', merchant: 'Google', category: 'Software', amount: -1440.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN039', date: '2025-12-23', description: 'Industry Report', merchant: 'Gartner', category: 'Training', amount: -2500.00, status: 'Declined', cardLast4: '8832' },
  { id: 'TXN040', date: '2025-12-23', description: 'Holiday Party Venue', merchant: 'Event Space NYC', category: 'Office', amount: -3500.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN041', date: '2025-12-22', description: 'Business Cards', merchant: 'Vistaprint', category: 'Marketing', amount: -89.99, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN042', date: '2025-12-22', description: 'Express Shipping', merchant: 'FedEx', category: 'Office', amount: -67.50, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN043', date: '2025-12-21', description: 'Notion Subscription', merchant: 'Notion', category: 'Software', amount: -96.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN044', date: '2025-12-21', description: 'Team Pizza Party', merchant: 'Domino\'s', category: 'Meals', amount: -145.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN045', date: '2025-12-20', description: 'Airport Lounge', merchant: 'Priority Pass', category: 'Travel', amount: -99.00, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN046', date: '2025-12-20', description: 'Figma License', merchant: 'Figma', category: 'Software', amount: -180.00, status: 'Cleared', cardLast4: '8832' },
  { id: 'TXN047', date: '2025-12-19', description: 'PR Agency Retainer', merchant: 'Press Relations Inc', category: 'Marketing', amount: -4500.00, status: 'Pending', cardLast4: '8832' },
  { id: 'TXN048', date: '2025-12-19', description: 'Lunch Meeting', merchant: 'Sweetgreen', category: 'Meals', amount: -45.80, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN049', date: '2025-12-18', description: 'Monitor Stand', merchant: 'Amazon', category: 'Office', amount: -79.99, status: 'Cleared', cardLast4: '4521' },
  { id: 'TXN050', date: '2025-12-18', description: 'Flight to SF', merchant: 'United Airlines', category: 'Travel', amount: -487.00, status: 'Cleared', cardLast4: '4521' },
];

// Generate more transactions to have 100 total
function generateMoreTransactions(): Transaction[] {
  const merchants = ['Amazon', 'Uber', 'Delta', 'Marriott', 'AWS', 'Google', 'Adobe', 'Slack', 'Zoom', 'FedEx'];
  const categories = ['Office', 'Travel', 'Software', 'Meals', 'Marketing', 'Training'];
  const statuses: ('Cleared' | 'Pending' | 'Declined')[] = ['Cleared', 'Cleared', 'Cleared', 'Pending', 'Declined'];
  const cards = ['4521', '8832'];

  const additional: Transaction[] = [];
  for (let i = 51; i <= 100; i++) {
    const dayOffset = Math.floor((i - 51) / 3);
    const date = new Date('2025-12-17');
    date.setDate(date.getDate() - dayOffset);

    additional.push({
      id: `TXN${String(i).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      description: `Transaction ${i}`,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: -(Math.random() * 1000 + 50).toFixed(2) as unknown as number,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      cardLast4: cards[Math.floor(Math.random() * cards.length)],
    });
  }
  return additional;
}

const fullDataset = [...allTransactions, ...generateMoreTransactions()];

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  private readonly SIMULATED_DELAY = 800; // ms

  /**
   * Simulates a server-side API call with filtering, sorting, and pagination
   */
  getTransactions(params: TransactionQueryParams): Observable<TransactionResponse> {
    let filtered = [...fullDataset];

    // Apply status filter
    if (params.filterStatus) {
      filtered = filtered.filter((t) => t.status === params.filterStatus);
    }

    // Apply category filter
    if (params.filterCategory) {
      filtered = filtered.filter((t) => t.category === params.filterCategory);
    }

    // Apply search
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(term) ||
          t.merchant.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (params.sortField) {
      filtered.sort((a, b) => {
        const aVal = a[params.sortField as keyof Transaction];
        const bVal = b[params.sortField as keyof Transaction];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return params.sortDirection === 'desc'
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return params.sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
        }
        return 0;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / params.pageSize);
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const data = filtered.slice(start, end);

    const response: TransactionResponse = {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
    };

    // Simulate network delay
    return of(response).pipe(delay(this.SIMULATED_DELAY));
  }

  /**
   * Get unique categories for filter dropdown
   */
  getCategories(): Observable<string[]> {
    const categories = [...new Set(fullDataset.map((t) => t.category))].sort();
    return of(categories).pipe(delay(200));
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getStatuses(): Observable<string[]> {
    const statuses = [...new Set(fullDataset.map((t) => t.status))];
    return of(statuses).pipe(delay(200));
  }
}
