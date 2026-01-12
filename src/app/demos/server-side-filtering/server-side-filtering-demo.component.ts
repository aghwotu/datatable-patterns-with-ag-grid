import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
  SortChangedEvent,
} from 'ag-grid-community';
import {
  TransactionApiService,
  Transaction,
  TransactionQueryParams,
} from './services/transaction-api.service';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-server-side-filtering-demo',
  imports: [AgGridAngular, RouterLink, FormsModule],
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
        class="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 relative"
        style="view-transition-name: demo-preview-server-side-filtering"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-server-side-filtering"
            >
              Server-Side Filtering
            </h1>
            <p class="text-zinc-200 text-lg mb-5">
              Demonstrates server-side filtering and pagination with AG-Grid Community Edition.
              Data is fetched from a mock API with simulated network delay. Watch the loading
              indicator when changing filters or pages.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Server-Side Data
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                API Pagination
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Loading States
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Controls -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="relative flex-1 min-w-[200px] max-w-sm">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              class="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            />
          </div>

          <!-- Status Filter -->
          <select
            [(ngModel)]="filterStatus"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          >
            <option value="">All Statuses</option>
            @for (status of statuses(); track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>

          <!-- Category Filter -->
          <select
            [(ngModel)]="filterCategory"
            (ngModelChange)="onFilterChange()"
            class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          >
            <option value="">All Categories</option>
            @for (category of categories(); track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>

          <!-- Loading Indicator -->
          @if (loading()) {
            <div class="flex items-center gap-2 text-sky-400">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-sm">Loading...</span>
            </div>
          }
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="max-w-7xl w-full mx-auto px-6 pb-2">
        <div class="text-sm text-zinc-400">
          Showing
          <span class="text-zinc-100 font-medium">{{ displayRange() }}</span>
          of
          <span class="text-zinc-100 font-medium">{{ totalRecords() }}</span>
          transactions
          <span class="text-zinc-600 mx-2">•</span>
          <span class="text-zinc-500">Page {{ currentPage() }} of {{ totalPages() }}</span>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 px-6 pb-4">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden h-[420px] md:h-[450px]"
            [class.opacity-60]="loading()"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="rowData()"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [suppressPaginationPanel]="true"
              (gridReady)="onGridReady($event)"
              (sortChanged)="onSortChanged($event)"
            />
          </div>
        </div>
      </div>

      <!-- Custom Pagination -->
      <div class="max-w-7xl w-full mx-auto px-6 pb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-400">Rows per page:</span>
            <select
              [(ngModel)]="pageSize"
              (ngModelChange)="onPageSizeChange()"
              class="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            >
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="goToPage(1)"
              [disabled]="currentPage() === 1 || loading()"
              class="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 19l-7-7m0 0l7-7m-7 7h18M5 12H3"
                />
              </svg>
            </button>
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1 || loading()"
              class="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              @for (page of visiblePages(); track page) {
                @if (page === '...') {
                  <span class="px-2 text-zinc-500">...</span>
                } @else {
                  <button
                    (click)="goToPage(+page)"
                    [disabled]="loading()"
                    [class.bg-sky-600]="currentPage() === +page"
                    [class.border-sky-500]="currentPage() === +page"
                    [class.bg-zinc-800]="currentPage() !== +page"
                    [class.border-zinc-700]="currentPage() !== +page"
                    class="w-8 h-8 rounded-lg border text-zinc-100 text-sm font-medium hover:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ page }}
                  </button>
                }
              }
            </div>

            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages() || loading()"
              class="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              (click)="goToPage(totalPages())"
              [disabled]="currentPage() === totalPages() || loading()"
              class="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5l7 7-7 7M5 12h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Feature Explanation -->
      <div class="border-t border-zinc-800/50 bg-zinc-900/30">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">How It Works</h3>
          <div class="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">1. Mock API Service</h4>
              <p>
                A service simulates server responses with
                <code class="text-sky-400">800ms</code> delay. It handles filtering, sorting, and
                pagination logic server-side.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">2. Query Parameters</h4>
              <p>
                When filters change, we send
                <code class="text-sky-400">page</code>,
                <code class="text-sky-400">pageSize</code>,
                <code class="text-sky-400">sortField</code>, and filter values to the API.
              </p>
            </div>
            <div>
              <h4 class="text-zinc-200 font-medium mb-2">3. Loading States</h4>
              <p>
                The grid dims and a spinner shows during API calls. This provides clear feedback
                that data is being fetched.
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
export class ServerSideFilteringDemoComponent implements OnInit {
  private api = inject(TransactionApiService);
  private gridApi = signal<GridApi<Transaction> | null>(null);
  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  // State
  loading = signal(false);
  rowData = signal<Transaction[]>([]);
  totalRecords = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  categories = signal<string[]>([]);
  statuses = signal<string[]>([]);

  // Filters
  searchTerm = '';
  filterStatus = '';
  filterCategory = '';
  pageSize = 10;
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#0c4a6e',
    accentColor: '#0ea5e9',
  });

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  columnDefs: ColDef<Transaction>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'description', headerName: 'Description', minWidth: 200 },
    { field: 'merchant', headerName: 'Merchant', width: 150 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: (params) => {
        const value = params.value as number;
        return Math.abs(value).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      },
      cellStyle: () => ({ color: '#f87171', fontWeight: '500' }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Cleared: { bg: '#065f4620', text: '#4ade80' },
          Pending: { bg: '#78350f20', text: '#fbbf24' },
          Declined: { bg: '#7f1d1d20', text: '#f87171' },
        };
        const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
        return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
      },
    },
    { field: 'cardLast4', headerName: 'Card', width: 80, valueFormatter: (p) => `****${p.value}` },
  ];

  displayRange = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, this.totalRecords());
    return `${start}-${end}`;
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (string | number)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadData();
  }

  onGridReady(event: GridReadyEvent<Transaction>): void {
    this.gridApi.set(event.api);
  }

  onSortChanged(event: SortChangedEvent<Transaction>): void {
    const columnState = event.api.getColumnState();
    const sortedColumn = columnState.find((col) => col.sort);

    if (sortedColumn) {
      this.sortField = sortedColumn.colId;
      this.sortDirection = sortedColumn.sort as 'asc' | 'desc';
    } else {
      this.sortField = '';
      this.sortDirection = 'asc';
    }

    this.currentPage.set(1);
    this.loadData();
  }

  onSearchChange(): void {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    this.searchDebounce = setTimeout(() => {
      this.currentPage.set(1);
      this.loadData();
    }, 400);
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }

  private loadFilterOptions(): void {
    this.api.getCategories().subscribe((cats) => this.categories.set(cats));
    this.api.getStatuses().subscribe((stats) => this.statuses.set(stats));
  }

  private loadData(): void {
    this.loading.set(true);

    const params: TransactionQueryParams = {
      page: this.currentPage(),
      pageSize: this.pageSize,
      sortField: this.sortField || undefined,
      sortDirection: this.sortDirection,
      filterStatus: this.filterStatus || undefined,
      filterCategory: this.filterCategory || undefined,
      searchTerm: this.searchTerm || undefined,
    };

    this.api.getTransactions(params).subscribe({
      next: (response) => {
        this.rowData.set(response.data);
        this.totalRecords.set(response.total);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
