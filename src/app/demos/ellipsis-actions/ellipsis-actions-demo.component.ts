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
import {
  AgGridEllipsisMenuComponent,
  GridAction,
} from '@shared/menus/ag-grid-ellipsis-menu/ag-grid-ellipsis-menu.component';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface Payment {
  id: string;
  date: string;
  payee: string;
  category: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Flagged';
  accountNumber: string;
  reference: string;
  reconciled: boolean;
}

// Payment mock data
const paymentData: Payment[] = [
  {
    id: 'PAY001',
    date: '2026-01-08',
    payee: 'Office Supplies Co',
    category: 'Office Expenses',
    amount: -342.5,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'INV-2026-0108',
    reconciled: true,
  },
  {
    id: 'PAY002',
    date: '2026-01-07',
    payee: 'Cloud Services Inc',
    category: 'Software',
    amount: -99.0,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'SUB-CLOUD-JAN',
    reconciled: false,
  },
  {
    id: 'PAY003',
    date: '2026-01-07',
    payee: 'Marketing Agency',
    category: 'Marketing',
    amount: -2500.0,
    status: 'Pending',
    accountNumber: '****4521',
    reference: 'MKT-Q1-2026',
    reconciled: false,
  },
  {
    id: 'PAY004',
    date: '2026-01-06',
    payee: 'Freelancer - John D.',
    category: 'Contractors',
    amount: -1200.0,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'CONT-JD-0106',
    reconciled: true,
  },
  {
    id: 'PAY005',
    date: '2026-01-06',
    payee: 'Insurance Provider',
    category: 'Insurance',
    amount: -450.0,
    status: 'Failed',
    accountNumber: '****4521',
    reference: 'INS-JAN-2026',
    reconciled: false,
  },
  {
    id: 'PAY006',
    date: '2026-01-05',
    payee: 'Client Payment - ABC Corp',
    category: 'Revenue',
    amount: 8500.0,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'RCV-ABC-0105',
    reconciled: true,
  },
  {
    id: 'PAY007',
    date: '2026-01-05',
    payee: 'Utility Company',
    category: 'Utilities',
    amount: -187.32,
    status: 'Flagged',
    accountNumber: '****4521',
    reference: 'UTIL-JAN-2026',
    reconciled: false,
  },
  {
    id: 'PAY008',
    date: '2026-01-04',
    payee: 'Equipment Lease',
    category: 'Equipment',
    amount: -750.0,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'LEASE-EQ-JAN',
    reconciled: false,
  },
  {
    id: 'PAY009',
    date: '2026-01-04',
    payee: 'Tax Payment',
    category: 'Taxes',
    amount: -3200.0,
    status: 'Pending',
    accountNumber: '****8832',
    reference: 'TAX-Q4-2025',
    reconciled: false,
  },
  {
    id: 'PAY010',
    date: '2026-01-03',
    payee: 'Client Payment - XYZ Ltd',
    category: 'Revenue',
    amount: 4200.0,
    status: 'Completed',
    accountNumber: '****4521',
    reference: 'RCV-XYZ-0103',
    reconciled: true,
  },
];

@Component({
  selector: 'app-ellipsis-actions-demo',
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
        class="bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700 relative"
        style="view-transition-name: demo-preview-ellipsis-actions"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-ellipsis-actions"
            >
              Ellipsis Actions Menu
            </h1>
            <p class="text-zinc-200 text-lg mb-5">
              Each row has a contextual three-dot menu with actions. Actions can be dynamically
              hidden or disabled based on row data—for example, "Mark as Reconciled" is disabled for
              already-reconciled items.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Row Actions
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Contextual Menu
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Cell Renderer
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Log -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-zinc-400">
            <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> payments
          </div>
          @if (lastAction()) {
            <div
              class="text-sm bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-1.5 text-zinc-300"
            >
              <span class="text-zinc-500">Last action:</span>
              {{ lastAction() }}
            </div>
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
              <h4 class="text-zinc-200 font-medium mb-2">1. Custom Cell Renderer</h4>
              <p>
                The ellipsis menu is a custom AG-Grid cell renderer that receives row data via
                <code class="text-violet-400">ICellRendererParams</code>.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">2. Dynamic Actions</h4>
              <p>
                Actions can have <code class="text-violet-400">hidden</code> and
                <code class="text-violet-400">disabled</code> functions that receive the row data
                and return boolean values.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">3. Contextual Behavior</h4>
              <p>
                Try clicking the menu on different rows—actions like "Retry Payment" only appear for
                failed payments, and "Mark as Reconciled" is disabled for already-reconciled items.
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
export class EllipsisActionsDemoComponent {
  gridApi = signal<GridApi<Payment> | null>(null);
  lastAction = signal<string>('');

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#4c1d95',
    accentColor: '#8b5cf6',
  });

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  rowData = paymentData;

  // Define actions for the ellipsis menu
  private readonly gridActions: GridAction<Payment>[] = [
    {
      label: 'View Details',
      action: (row) => this.logAction(`Viewing details for ${row.payee}`),
    },
    {
      label: 'Download Receipt',
      action: (row) => this.logAction(`Downloading receipt for ${row.reference}`),
      disabled: (row) => row.status === 'Pending', // Can't download receipt for pending
    },
    {
      label: 'Mark as Reconciled',
      action: (row) => this.logAction(`Marked ${row.reference} as reconciled`),
      disabled: (row) => row.reconciled, // Already reconciled
    },
    {
      label: 'Flag for Review',
      action: (row) => this.logAction(`Flagged ${row.payee} for review`),
      hidden: (row) => row.status === 'Flagged', // Already flagged
    },
    {
      label: 'Retry Payment',
      action: (row) => this.logAction(`Retrying payment to ${row.payee}`),
      hidden: (row) => row.status !== 'Failed', // Only show for failed payments
    },
    {
      label: 'Report Dispute',
      action: (row) => this.logAction(`Opening dispute for ${row.reference}`),
      disabled: (row) => row.status === 'Pending',
    },
  ];

  columnDefs: ColDef<Payment>[] = [
    { field: 'id', headerName: 'ID', width: 100, pinned: 'left' },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'payee', headerName: 'Payee', minWidth: 180 },
    { field: 'category', headerName: 'Category', width: 140 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
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
      width: 120,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Completed: { bg: '#065f4620', text: '#4ade80' },
          Pending: { bg: '#78350f20', text: '#fbbf24' },
          Failed: { bg: '#7f1d1d20', text: '#f87171' },
          Flagged: { bg: '#4c1d9520', text: '#a78bfa' },
        };
        const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
        return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
      },
    },
    {
      field: 'reconciled',
      headerName: 'Reconciled',
      width: 110,
      cellRenderer: (params: { value: boolean }) =>
        params.value
          ? '<span class="text-emerald-400">✓ Yes</span>'
          : '<span class="text-zinc-500">No</span>',
    },
    { field: 'reference', headerName: 'Reference', width: 150 },
    {
      headerName: '',
      colId: 'actions',
      pinned: 'right',
      width: 60,
      filter: false,
      sortable: false,
      cellRenderer: AgGridEllipsisMenuComponent,
      cellRendererParams: {
        actions: this.gridActions,
      },
      cellClass: 'flex items-center justify-center',
    },
  ];

  onGridReady(event: GridReadyEvent<Payment>): void {
    this.gridApi.set(event.api);
  }

  private logAction(message: string): void {
    this.lastAction.set(message);
    console.log('[Action]', message);
  }
}
