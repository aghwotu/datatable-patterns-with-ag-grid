import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
import { TradingApiService, TradingOrder, TradingOrdersRequest } from './services/trading-api.service';
import { OrderTypeFilterComponent } from './filters/order-type-filter.component';
import { SideFilterComponent } from './filters/side-filter.component';
import { StatusFilterComponent } from './filters/status-filter.component';
import { OrderActionsComponent } from './components/order-actions.component';
import { TrendCellComponent } from '../custom-cell-renderers/renderers/trend-cell.component';
import { ProgressCellComponent } from '../custom-cell-renderers/renderers/progress-cell.component';
import { BadgeCellComponent } from '../custom-cell-renderers/renderers/badge-cell.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-trading-platform-demo',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AgGridAngular,
    ColumnVisibilityMenuComponent,
  ],
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
      <div class="bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 relative">
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1 class="text-3xl md:text-4xl font-bold mb-3 text-white">Trading Platform</h1>
            <p class="text-zinc-200 text-lg mb-5">
              A comprehensive trading orders grid combining all AG-Grid features: column visibility,
              ellipsis actions, floating filters, server-side pagination, and custom cell renderers.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                All Features
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Server-Side Data
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Trading Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Bar -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
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
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search by symbol, trader, or order ID..."
              class="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <!-- Stats and Controls -->
          <div class="flex items-center gap-4">
            <div class="text-sm text-zinc-400">
              @if (isLoading()) {
                <span class="text-amber-400">Loading...</span>
              } @else {
                <span class="text-zinc-100 font-medium">{{ totalRecords() }}</span> orders
              }
            </div>
            @if (gridApi()) {
              <app-column-visibility-menu
                [gridApi]="gridApi()!"
                (columnVisibilityChanged)="onColumnVisibilityChanged($event)"
              />
            }
          </div>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 px-6 pb-6">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden"
            [class.opacity-60]="isLoading()"
          >
            <ag-grid-angular
              class="w-full"
              [style.height.px]="gridHeight"
              [theme]="theme"
              [rowData]="rowData()"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [rowHeight]="52"
              [headerHeight]="44"
              [floatingFiltersHeight]="44"
              [animateRows]="true"
              [suppressPaginationPanel]="true"
              (gridReady)="onGridReady($event)"
              (filterChanged)="onFilterChanged()"
            />
          </div>

          <!-- Custom Pagination -->
          <div
            class="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400"
          >
            <div class="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                [(ngModel)]="pageSize"
                (ngModelChange)="onPageSizeChange()"
                class="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option [value]="10">10</option>
                <option [value]="20">20</option>
                <option [value]="50">50</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <span>
                {{ paginationInfo() }}
              </span>
            </div>

            <div class="flex items-center gap-1">
              <button
                (click)="goToPage(1)"
                [disabled]="currentPage() === 1 || isLoading()"
                class="p-2 rounded hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1 || isLoading()"
                class="p-2 rounded hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

              @for (page of visiblePages(); track page) {
                <button
                  (click)="goToPage(page)"
                  [disabled]="isLoading()"
                  class="w-8 h-8 rounded text-sm font-medium transition-colors"
                  [class.bg-amber-600]="page === currentPage()"
                  [class.text-white]="page === currentPage()"
                  [class.hover:bg-zinc-800]="page !== currentPage()"
                >
                  {{ page }}
                </button>
              }

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages() || isLoading()"
                class="p-2 rounded hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                [disabled]="currentPage() === totalPages() || isLoading()"
                class="p-2 rounded hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Legend -->
      <div class="border-t border-zinc-800/50 bg-zinc-900/30">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">Features Demonstrated</h3>
          <div class="grid md:grid-cols-5 gap-4 text-sm">
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">📊</span>
                <h4 class="text-zinc-200 font-medium">Column Visibility</h4>
              </div>
              <p class="text-zinc-500">Toggle columns via dropdown menu</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">⋮</span>
                <h4 class="text-zinc-200 font-medium">Ellipsis Actions</h4>
              </div>
              <p class="text-zinc-500">Context-aware row actions</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">🔽</span>
                <h4 class="text-zinc-200 font-medium">Floating Filters</h4>
              </div>
              <p class="text-zinc-500">Dropdown filters above columns</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">🔄</span>
                <h4 class="text-zinc-200 font-medium">Server-Side</h4>
              </div>
              <p class="text-zinc-500">API pagination & loading</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">🎨</span>
                <h4 class="text-zinc-200 font-medium">Cell Renderers</h4>
              </div>
              <p class="text-zinc-500">Custom visual components</p>
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
export class TradingPlatformDemoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private _gridApi: GridApi<TradingOrder> | null = null;

  gridApi = signal<GridApi<TradingOrder> | null>(null);
  rowData = signal<TradingOrder[]>([]);
  isLoading = signal(true);
  totalRecords = signal(0);
  currentPage = signal(1);

  searchTerm = '';
  pageSize = 10;
  gridHeight = 520;

  // Filters state
  private orderTypeFilter?: string;
  private sideFilter?: string;
  private statusFilter?: string;

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#78350f',
    accentColor: '#f59e0b',
  });

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 80,
    resizable: true,
    sortable: false, // Disabled for server-side
  };

  columnDefs: ColDef<TradingOrder>[] = [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 110,
      pinned: 'left',
      cellClass: 'font-mono text-zinc-400',
    },
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 100,
      cellRenderer: BadgeCellComponent,
      cellClass: 'font-bold',
    },
    {
      field: 'orderType',
      headerName: 'Type',
      width: 110,
      floatingFilterComponent: OrderTypeFilterComponent,
      filter: true,
    },
    {
      field: 'side',
      headerName: 'Side',
      width: 90,
      floatingFilterComponent: SideFilterComponent,
      filter: true,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Buy: { bg: '#14532d40', text: '#4ade80' },
          Sell: { bg: '#7f1d1d40', text: '#f87171' },
        };
        const style = colors[params.value];
        return style
          ? { backgroundColor: style.bg, color: style.text, fontWeight: '600' }
          : null;
      },
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 90,
      valueFormatter: (params) => params.value?.toLocaleString() || '',
    },
    {
      field: 'filledQty',
      headerName: 'Filled',
      width: 100,
      cellRenderer: ProgressCellComponent,
      cellRendererParams: {
        maxField: 'quantity',
      },
    },
    {
      field: 'avgPrice',
      headerName: 'Avg Price',
      width: 110,
      valueFormatter: (params) => (params.value ? `$${params.value.toFixed(2)}` : ''),
      cellClass: 'font-mono',
    },
    {
      field: 'limitPrice',
      headerName: 'Limit',
      width: 100,
      valueFormatter: (params) => (params.value ? `$${params.value.toFixed(2)}` : '—'),
      cellClass: 'font-mono text-zinc-500',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      floatingFilterComponent: StatusFilterComponent,
      filter: true,
      cellStyle: (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Filled: { bg: '#14532d40', text: '#4ade80' },
          Partial: { bg: '#78350f40', text: '#fbbf24' },
          Pending: { bg: '#1e3a5f40', text: '#60a5fa' },
          Cancelled: { bg: '#7f1d1d40', text: '#f87171' },
        };
        const style = colors[params.value];
        return style
          ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' }
          : null;
      },
    },
    {
      field: 'pnl',
      headerName: 'P&L',
      width: 100,
      cellRenderer: TrendCellComponent,
    },
    {
      field: 'commission',
      headerName: 'Commission',
      width: 110,
      valueFormatter: (params) => (params.value ? `$${params.value.toFixed(2)}` : ''),
      cellClass: 'font-mono text-zinc-500',
    },
    {
      field: 'trader',
      headerName: 'Trader',
      width: 130,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 140,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      cellClass: 'text-zinc-500',
    },
    {
      headerName: '',
      width: 60,
      pinned: 'right',
      cellRenderer: OrderActionsComponent,
      resizable: false,
      suppressHeaderMenuButton: true,
    },
  ];

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize) || 1);

  paginationInfo = computed(() => {
    const total = this.totalRecords();
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, total);
    return total > 0 ? `${start}-${end} of ${total}` : '0 results';
  });

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(5, total);
      else start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  constructor(private tradingApiService: TradingApiService) {}

  ngOnInit(): void {
    // Set up debounced search
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadData();
      });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(event: GridReadyEvent<TradingOrder>): void {
    this._gridApi = event.api;
    this.gridApi.set(event.api);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onFilterChanged(): void {
    // Read filter values from columns
    if (this._gridApi) {
      const orderTypeCol = this._gridApi.getColumn('orderType');
      const sideCol = this._gridApi.getColumn('side');
      const statusCol = this._gridApi.getColumn('status');

      this.orderTypeFilter = (orderTypeCol as any)?.orderTypeFilter;
      this.sideFilter = (sideCol as any)?.sideFilter;
      this.statusFilter = (statusCol as any)?.statusFilter;

      this.currentPage.set(1);
      this.loadData();
    }
  }

  onColumnVisibilityChanged(event: { field: string; visible: boolean }): void {
    // Update column visibility through the grid API
    const column = this._gridApi?.getColumn(event.field);
    if (column) {
      this._gridApi?.setColumnsVisible([event.field], event.visible);
    }
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }

  private loadData(): void {
    this.isLoading.set(true);

    const request: TradingOrdersRequest = {
      page: this.currentPage(),
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      orderType: this.orderTypeFilter,
      side: this.sideFilter,
      status: this.statusFilter,
    };

    this.tradingApiService
      .getOrders(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.rowData.set(response.data);
        this.totalRecords.set(response.total);
        this.isLoading.set(false);
      });
  }
}
