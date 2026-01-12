import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
} from 'ag-grid-community';
import { TransactionTypeFilterComponent } from './filters/transaction-type-filter.component';
import { StatusFilterComponent } from './filters/status-filter.component';
import { CategoryFilterComponent } from './filters/category-filter.component';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface BusinessTransaction {
  id: string;
  date: string;
  description: string;
  type: 'Credit' | 'Debit' | 'Transfer';
  category: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
  account: string;
  counterparty: string;
}

// Business transaction mock data
const transactionData: BusinessTransaction[] = [
  {
    id: 'TRX001',
    date: '2026-01-08',
    description: 'Q1 Marketing Campaign',
    type: 'Debit',
    category: 'Marketing',
    amount: -15000.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Digital Ads Co',
  },
  {
    id: 'TRX002',
    date: '2026-01-08',
    description: 'Client Invoice #1847',
    type: 'Credit',
    category: 'Revenue',
    amount: 42500.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Acme Corporation',
  },
  {
    id: 'TRX003',
    date: '2026-01-07',
    description: 'AWS Monthly Bill',
    type: 'Debit',
    category: 'Software',
    amount: -3247.89,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Amazon Web Services',
  },
  {
    id: 'TRX004',
    date: '2026-01-07',
    description: 'January Payroll',
    type: 'Debit',
    category: 'Payroll',
    amount: -87500.0,
    status: 'Processing',
    account: 'Payroll ****3344',
    counterparty: 'ADP Payroll',
  },
  {
    id: 'TRX005',
    date: '2026-01-06',
    description: 'Office Electricity',
    type: 'Debit',
    category: 'Utilities',
    amount: -892.45,
    status: 'Pending',
    account: 'Operating ****7821',
    counterparty: 'City Power & Light',
  },
  {
    id: 'TRX006',
    date: '2026-01-06',
    description: 'Legal Consultation',
    type: 'Debit',
    category: 'Professional Services',
    amount: -4500.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Smith & Associates',
  },
  {
    id: 'TRX007',
    date: '2026-01-05',
    description: 'Transfer to Savings',
    type: 'Transfer',
    category: 'Transfer',
    amount: -25000.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Reserve ****9912',
  },
  {
    id: 'TRX008',
    date: '2026-01-05',
    description: 'Equipment Lease',
    type: 'Debit',
    category: 'Equipment',
    amount: -2150.0,
    status: 'Failed',
    account: 'Operating ****7821',
    counterparty: 'Tech Leasing Inc',
  },
  {
    id: 'TRX009',
    date: '2026-01-04',
    description: 'Client Invoice #1842',
    type: 'Credit',
    category: 'Revenue',
    amount: 18750.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Global Tech Ltd',
  },
  {
    id: 'TRX010',
    date: '2026-01-04',
    description: 'Slack Subscription',
    type: 'Debit',
    category: 'Software',
    amount: -1250.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Slack Technologies',
  },
  {
    id: 'TRX011',
    date: '2026-01-03',
    description: 'Transfer from Reserve',
    type: 'Transfer',
    category: 'Transfer',
    amount: 50000.0,
    status: 'Completed',
    account: 'Operating ****7821',
    counterparty: 'Reserve ****9912',
  },
  {
    id: 'TRX012',
    date: '2026-01-03',
    description: 'Internet Service',
    type: 'Debit',
    category: 'Utilities',
    amount: -399.99,
    status: 'Pending',
    account: 'Operating ****7821',
    counterparty: 'Fiber Connect Inc',
  },
];

@Component({
  selector: 'app-floating-filters-demo',
  imports: [AgGridAngular, RouterLink],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <!-- Header -->
      <header class="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center gap-4">
            <a
              routerLink="/"
              class="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group"
            >
              <div
                class="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium">Back to Demos</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Demo Info Banner -->
      <div
        class="bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 relative"
        style="view-transition-name: demo-preview-floating-filters"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-floating-filters"
            >
              Floating Filter Dropdowns
            </h1>
            <p class="text-zinc-200 text-lg mb-5">
              Custom dropdown filters appear directly above columns for quick, intuitive filtering.
              Use the dropdowns for Type, Status, and Category to filter the transaction data
              instantly.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Floating Filters
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Custom Components
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Client-Side Filtering
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Bar -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-zinc-400">
            <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> transactions •
            <span class="text-zinc-500">Use the dropdowns in the filter row to filter</span>
          </div>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 px-6 pb-6">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden h-[500px] md:h-[550px]"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="rowData"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [pagination]="true"
              [paginationPageSize]="10"
              (gridReady)="onGridReady($event)"
            />
          </div>
        </div>
      </div>

      <!-- Feature Explanation -->
      <div class="border-t border-zinc-800/50 bg-zinc-900/30">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">How It Works</h3>
          <div class="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">1. IFloatingFilter Interface</h4>
              <p>
                Each filter implements AG-Grid's
                <code class="text-amber-400">IFloatingFilter</code> interface with
                <code class="text-amber-400">agInit</code> and
                <code class="text-amber-400">onParentModelChanged</code> methods.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">2. Custom Dropdown Component</h4>
              <p>
                The filters use a reusable dropdown menu component built with Angular CDK Menu,
                maintaining consistent styling and behavior.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">3. Parent Filter Communication</h4>
              <p>
                When a selection is made, the floating filter calls
                <code class="text-amber-400">parentFilterInstance.onFloatingFilterChanged()</code>
                to update the column's filter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class FloatingFiltersDemoComponent {
  gridApi = signal<GridApi<BusinessTransaction> | null>(null);

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#7c2d12',
    accentColor: '#f97316',
  });

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  rowData = transactionData;

  columnDefs: ColDef<BusinessTransaction>[] = [
    { field: 'id', headerName: 'ID', width: 100, floatingFilter: false },
    { field: 'date', headerName: 'Date', width: 120, floatingFilter: false },
    { field: 'description', headerName: 'Description', minWidth: 200, floatingFilter: false },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      floatingFilterComponent: TransactionTypeFilterComponent,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Credit: { bg: '#065f4620', text: '#4ade80' },
          Debit: { bg: '#7f1d1d20', text: '#f87171' },
          Transfer: { bg: '#1e3a5f20', text: '#60a5fa' },
        };
        const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
        return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
      },
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 160,
      floatingFilterComponent: CategoryFilterComponent,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      floatingFilter: false,
      valueFormatter: (params) => {
        const value = params.value as number;
        const formatted = Math.abs(value).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return value < 0 ? `-${formatted}` : `+${formatted}`;
      },
      cellStyle: (params) => ({
        color: params.value < 0 ? '#f87171' : '#4ade80',
        fontWeight: '500',
      }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      floatingFilterComponent: StatusFilterComponent,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Completed: { bg: '#065f4620', text: '#4ade80' },
          Pending: { bg: '#78350f20', text: '#fbbf24' },
          Processing: { bg: '#1e3a5f20', text: '#60a5fa' },
          Failed: { bg: '#7f1d1d20', text: '#f87171' },
        };
        const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
        return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
      },
    },
    { field: 'counterparty', headerName: 'Counterparty', minWidth: 160, floatingFilter: false },
  ];

  onGridReady(event: GridReadyEvent<BusinessTransaction>): void {
    this.gridApi.set(event.api);
  }
}
