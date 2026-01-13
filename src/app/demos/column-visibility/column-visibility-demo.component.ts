import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
} from 'ag-grid-community';
import { ColumnVisibilityMenuComponent } from '@shared/menus/column-visibility-menu/column-visibility-menu.component';
import { DemoNavHeaderComponent } from '@shared/components/demo-nav-header/demo-nav-header.component';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  balance: number;
  reference: string;
  status: 'Completed' | 'Pending' | 'Failed';
  merchant: string;
  notes: string;
}

// Banking transaction mock data
const transactionData: BankTransaction[] = [
  {
    id: 'TXN001',
    date: '2026-01-08',
    description: 'Monthly Salary',
    category: 'Income',
    fromAccount: 'Employer Corp',
    toAccount: 'Checking ****4521',
    amount: 5250.0,
    balance: 12450.75,
    reference: 'SAL-JAN-2026',
    status: 'Completed',
    merchant: 'TechStart Inc',
    notes: 'January salary deposit',
  },
  {
    id: 'TXN002',
    date: '2026-01-07',
    description: 'Grocery Shopping',
    category: 'Food & Dining',
    fromAccount: 'Checking ****4521',
    toAccount: 'Whole Foods',
    amount: -127.43,
    balance: 7200.75,
    reference: 'POS-78291',
    status: 'Completed',
    merchant: 'Whole Foods Market',
    notes: 'Weekly groceries',
  },
  {
    id: 'TXN003',
    date: '2026-01-07',
    description: 'Electric Bill',
    category: 'Utilities',
    fromAccount: 'Checking ****4521',
    toAccount: 'City Power Co',
    amount: -145.0,
    balance: 7328.18,
    reference: 'UTIL-EP-0107',
    status: 'Completed',
    merchant: 'City Power Company',
    notes: 'Monthly electric bill',
  },
  {
    id: 'TXN004',
    date: '2026-01-06',
    description: 'Coffee Shop',
    category: 'Food & Dining',
    fromAccount: 'Checking ****4521',
    toAccount: 'Blue Bottle',
    amount: -8.75,
    balance: 7473.18,
    reference: 'POS-78234',
    status: 'Completed',
    merchant: 'Blue Bottle Coffee',
    notes: '',
  },
  {
    id: 'TXN005',
    date: '2026-01-06',
    description: 'Transfer to Savings',
    category: 'Transfer',
    fromAccount: 'Checking ****4521',
    toAccount: 'Savings ****8832',
    amount: -500.0,
    balance: 7481.93,
    reference: 'INT-TRF-0106',
    status: 'Completed',
    merchant: 'Internal Transfer',
    notes: 'Monthly savings',
  },
  {
    id: 'TXN006',
    date: '2026-01-05',
    description: 'Amazon Purchase',
    category: 'Shopping',
    fromAccount: 'Checking ****4521',
    toAccount: 'Amazon.com',
    amount: -89.99,
    balance: 7981.93,
    reference: 'AMZ-112-8834',
    status: 'Completed',
    merchant: 'Amazon.com',
    notes: 'Household items',
  },
  {
    id: 'TXN007',
    date: '2026-01-05',
    description: 'Gas Station',
    category: 'Transportation',
    fromAccount: 'Checking ****4521',
    toAccount: 'Shell',
    amount: -52.3,
    balance: 8071.92,
    reference: 'POS-77891',
    status: 'Completed',
    merchant: 'Shell Gas Station',
    notes: 'Fuel',
  },
  {
    id: 'TXN008',
    date: '2026-01-04',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    fromAccount: 'Checking ****4521',
    toAccount: 'Netflix',
    amount: -15.99,
    balance: 8124.22,
    reference: 'NFLX-SUB-JAN',
    status: 'Completed',
    merchant: 'Netflix Inc',
    notes: 'Monthly subscription',
  },
  {
    id: 'TXN009',
    date: '2026-01-04',
    description: 'Freelance Payment',
    category: 'Income',
    fromAccount: 'Client ABC',
    toAccount: 'Checking ****4521',
    amount: 750.0,
    balance: 8140.21,
    reference: 'INV-2026-001',
    status: 'Completed',
    merchant: 'ABC Consulting',
    notes: 'Website design project',
  },
  {
    id: 'TXN010',
    date: '2026-01-03',
    description: 'Rent Payment',
    category: 'Housing',
    fromAccount: 'Checking ****4521',
    toAccount: 'Parkview Apts',
    amount: -1850.0,
    balance: 7390.21,
    reference: 'RENT-JAN-2026',
    status: 'Completed',
    merchant: 'Parkview Apartments',
    notes: 'January rent',
  },
  {
    id: 'TXN011',
    date: '2026-01-03',
    description: 'Wire Transfer - Pending',
    category: 'Transfer',
    fromAccount: 'External Bank',
    toAccount: 'Checking ****4521',
    amount: 2500.0,
    balance: 9240.21,
    reference: 'WIRE-IN-88123',
    status: 'Pending',
    merchant: 'Wire Transfer',
    notes: 'Expected by Jan 10',
  },
  {
    id: 'TXN012',
    date: '2026-01-02',
    description: 'Failed ACH Payment',
    category: 'Other',
    fromAccount: 'Checking ****4521',
    toAccount: 'Unknown Payee',
    amount: -200.0,
    balance: 6740.21,
    reference: 'ACH-FAIL-9912',
    status: 'Failed',
    merchant: 'ACH Network',
    notes: 'Insufficient payee info',
  },
];

@Component({
  selector: 'app-column-visibility-demo',
  imports: [AgGridAngular, ColumnVisibilityMenuComponent, DemoNavHeaderComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="'column-visibility'" />

      <!-- Demo Info Banner -->
      <div
        class="bg-linear-to-br from-emerald-500 via-teal-600 to-cyan-700 relative"
        style="view-transition-name: demo-preview-column-visibility"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-column-visibility"
            >
              Column Management
            </h1>
            <p class="text-zinc-200 text-lg mb-5">
              A comprehensive transaction history table with many columns. Toggle which columns to
              display using the dropdown menu. Perfect for tables with extensive data where users
              need to focus on specific fields.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Column Management
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Banking
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                CDK Menu
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar with Column Visibility -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-zinc-400">
            <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> transactions
          </div>
          @if (gridApi()) {
          <app-column-visibility-menu
            [gridApi]="gridApi()!"
            [excludeFields]="['id']"
            (columnVisibilityChanged)="onColumnVisibilityChanged($event)"
            [size]="'sm'"
            [variant]="'outline'"
            [weight]="'normal'"
            [menuWidth]="'w-52'"
          />
          }
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
              [columnDefs]="columnDefs()"
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
              <h4 class="text-zinc-200 font-medium mb-2">1. Checkbox Menu</h4>
              <p>
                Uses Angular CDK Menu with checkboxes to toggle column visibility. Maintains
                keyboard navigation and accessibility.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">2. Column Definitions Update</h4>
              <p>
                Instead of directly manipulating columns, we update column definitions via
                <code class="text-cyan-400">setGridOption('columnDefs', ...)</code>
                for stability.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">3. Excluded Fields</h4>
              <p>
                The ID column is excluded from the toggle menu since it should always be visible for
                reference.
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
export class ColumnVisibilityDemoComponent {
  gridApi = signal<GridApi<BankTransaction> | null>(null);

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#164e63',
    accentColor: '#06b6d4',
  });

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  rowData = transactionData;

  // Use signal for column definitions so we can update them
  columnDefs = signal<ColDef<BankTransaction>[]>([
    { field: 'id', headerName: 'ID', width: 100, pinned: 'left' },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'description', headerName: 'Description', minWidth: 180 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'fromAccount', headerName: 'From Account', width: 150 },
    { field: 'toAccount', headerName: 'To Account', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
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
      field: 'balance',
      headerName: 'Balance',
      width: 120,
      valueFormatter: (params) =>
        params.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    },
    { field: 'reference', headerName: 'Reference', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Completed: { bg: '#065f4620', text: '#4ade80' },
          Pending: { bg: '#78350f20', text: '#fbbf24' },
          Failed: { bg: '#7f1d1d20', text: '#f87171' },
        };
        const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
        return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
      },
    },
    { field: 'merchant', headerName: 'Merchant', width: 160, hide: true },
    { field: 'notes', headerName: 'Notes', width: 180, hide: true },
  ]);

  onGridReady(event: GridReadyEvent<BankTransaction>): void {
    this.gridApi.set(event.api);
  }

  onColumnVisibilityChanged(event: { field: string; visible: boolean }): void {
    this.columnDefs.update((currentDefs) =>
      currentDefs.map((def) => {
        if ('field' in def && def.field === event.field) {
          return { ...def, hide: !event.visible };
        }
        return def;
      })
    );

    // Update the grid with new column definitions
    this.gridApi()?.setGridOption('columnDefs', this.columnDefs());
  }
}
