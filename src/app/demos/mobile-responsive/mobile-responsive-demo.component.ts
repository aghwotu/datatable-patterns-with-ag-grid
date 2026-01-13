import { Component, computed, effect, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
  CellClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { DemoNavHeaderComponent } from '@shared/components/demo-nav-header/demo-nav-header.component';
import { injectCurrentBreakpoint, Breakpoint } from '@shared/utils/breakpoint';
import { BottomSheetService } from '@shared/components/bottom-sheet/bottom-sheet.service';
import { RowDetailsSheetComponent } from '@shared/components/bottom-sheet/row-details-sheet.component';

ModuleRegistry.registerModules([AllCommunityModule]);

interface CustomerOrder {
  id: string;
  customer: string;
  email: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Pending';
  orderDate: string;
  region: string;
}

const orderData: CustomerOrder[] = [
  {
    id: 'ORD-001',
    customer: 'Sarah Mitchell',
    email: 's.mitchell@techcorp.io',
    product: 'Wireless Headphones Pro',
    category: 'Electronics',
    quantity: 2,
    unitPrice: 149.99,
    total: 299.98,
    status: 'Delivered',
    orderDate: '2026-01-08',
    region: 'North America',
  },
  {
    id: 'ORD-002',
    customer: 'James Chen',
    email: 'j.chen@startup.dev',
    product: 'Ergonomic Keyboard',
    category: 'Accessories',
    quantity: 1,
    unitPrice: 189.0,
    total: 189.0,
    status: 'Shipped',
    orderDate: '2026-01-07',
    region: 'Asia Pacific',
  },
  {
    id: 'ORD-003',
    customer: 'Emily Rodriguez',
    email: 'e.rodriguez@design.co',
    product: '27" 4K Monitor',
    category: 'Electronics',
    quantity: 1,
    unitPrice: 549.99,
    total: 549.99,
    status: 'Processing',
    orderDate: '2026-01-07',
    region: 'North America',
  },
  {
    id: 'ORD-004',
    customer: 'Michael Thompson',
    email: 'm.thompson@corp.biz',
    product: 'USB-C Hub',
    category: 'Accessories',
    quantity: 3,
    unitPrice: 79.99,
    total: 239.97,
    status: 'Pending',
    orderDate: '2026-01-06',
    region: 'Europe',
  },
  {
    id: 'ORD-005',
    customer: 'Lisa Park',
    email: 'l.park@media.net',
    product: 'Webcam HD',
    category: 'Electronics',
    quantity: 2,
    unitPrice: 129.0,
    total: 258.0,
    status: 'Delivered',
    orderDate: '2026-01-06',
    region: 'Asia Pacific',
  },
  {
    id: 'ORD-006',
    customer: 'David Kim',
    email: 'd.kim@fintech.com',
    product: 'Laptop Stand',
    category: 'Accessories',
    quantity: 1,
    unitPrice: 89.99,
    total: 89.99,
    status: 'Shipped',
    orderDate: '2026-01-05',
    region: 'North America',
  },
  {
    id: 'ORD-007',
    customer: 'Anna Foster',
    email: 'a.foster@agency.io',
    product: 'Mechanical Keyboard',
    category: 'Accessories',
    quantity: 1,
    unitPrice: 159.99,
    total: 159.99,
    status: 'Delivered',
    orderDate: '2026-01-05',
    region: 'Europe',
  },
  {
    id: 'ORD-008',
    customer: 'Robert Wilson',
    email: 'r.wilson@enterprise.org',
    product: 'Noise-Canceling Earbuds',
    category: 'Electronics',
    quantity: 4,
    unitPrice: 199.99,
    total: 799.96,
    status: 'Processing',
    orderDate: '2026-01-04',
    region: 'North America',
  },
  {
    id: 'ORD-009',
    customer: 'Jennifer Lee',
    email: 'j.lee@creative.studio',
    product: 'Drawing Tablet',
    category: 'Electronics',
    quantity: 1,
    unitPrice: 349.0,
    total: 349.0,
    status: 'Shipped',
    orderDate: '2026-01-04',
    region: 'Asia Pacific',
  },
  {
    id: 'ORD-010',
    customer: 'Chris Martinez',
    email: 'c.martinez@dev.team',
    product: 'Monitor Arm',
    category: 'Accessories',
    quantity: 2,
    unitPrice: 119.99,
    total: 239.98,
    status: 'Pending',
    orderDate: '2026-01-03',
    region: 'Europe',
  },
];

@Component({
  selector: 'app-mobile-responsive-demo',
  standalone: true,
  imports: [AgGridAngular, DemoNavHeaderComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="'mobile-responsive'" />

      <!-- Demo Info Banner -->
      <div
        class="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 relative"
        style="view-transition-name: demo-preview-mobile-responsive"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div class="max-w-3xl">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-mobile-responsive"
            >
              Mobile Responsive Table
            </h1>
            <p class="text-zinc-200 text-sm sm:text-lg mb-4 sm:mb-5">
              Adaptive column layouts that respond to screen size. On mobile, columns collapse
              to essentials with a "View Details" action; on desktop, all columns are visible.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Breakpoint Detection
              </span>
              <span
                class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Adaptive Columns
              </span>
              <span
                class="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Bottom Sheet
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Breakpoint Indicator -->
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <div
              class="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
              [class]="getBreakpointClasses()"
            >
              {{ currentBreakpoint() }}
            </div>
            <span class="text-sm text-zinc-400">
              {{ getBreakpointDescription() }}
            </span>
          </div>
          <div class="text-sm text-zinc-500">
            <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> orders
          </div>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 px-4 sm:px-6 pb-6">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-xl sm:rounded-2xl overflow-hidden"
            [style.height.px]="gridHeight()"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="rowData"
              [columnDefs]="activeColumns()"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [rowHeight]="isMobile() ? 48 : 52"
              [headerHeight]="isMobile() ? 40 : 44"
              (gridReady)="onGridReady($event)"
            />
          </div>
        </div>
      </div>

      <!-- Feature Explanation -->
      <div class="border-t border-zinc-800/50 bg-zinc-900/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">How It Works</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm text-zinc-400">
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-indigo-400 text-lg">📱</span>
                <h4 class="text-zinc-200 font-medium">Breakpoint Detection</h4>
              </div>
              <p>
                Uses Angular CDK <code class="text-purple-400">BreakpointObserver</code> to
                detect mobile, tablet, and desktop viewports in real-time.
              </p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-indigo-400 text-lg">📊</span>
                <h4 class="text-zinc-200 font-medium">Adaptive Columns</h4>
              </div>
              <p>
                Column definitions change based on screen size. Mobile shows 2–3 essential
                columns; desktop shows all columns.
              </p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-indigo-400 text-lg">📋</span>
                <h4 class="text-zinc-200 font-medium">Details Sheet</h4>
              </div>
              <p>
                On mobile/tablet, a "View" button opens a bottom sheet with all row fields,
                avoiding horizontal scroll.
              </p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-indigo-400 text-lg">⚡</span>
                <h4 class="text-zinc-200 font-medium">Signals + Effects</h4>
              </div>
              <p>
                Uses Angular signals and <code class="text-purple-400">computed()</code> for
                reactive column switching without manual subscriptions.
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
export class MobileResponsiveDemoComponent {
  private bottomSheet = inject(BottomSheetService);
  private gridApi = signal<GridApi<CustomerOrder> | null>(null);

  // Breakpoint detection
  protected currentBreakpoint = injectCurrentBreakpoint();
  protected isMobile = computed(() => this.currentBreakpoint() === 'mobile');
  protected isTablet = computed(() => this.currentBreakpoint() === 'tablet');
  protected isDesktop = computed(() => this.currentBreakpoint() === 'desktop');

  // Responsive grid height
  protected gridHeight = computed(() => {
    if (this.isMobile()) return 400;
    if (this.isTablet()) return 450;
    return 500;
  });

  // Computed columns based on breakpoint
  protected activeColumns = computed(() => {
    if (this.isMobile()) {
      return this.getMobileColumns();
    }
    if (this.isTablet()) {
      return this.getTabletColumns();
    }
    return this.getDesktopColumns();
  });

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

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 80,
    resizable: true,
    sortable: true,
  };

  rowData = orderData;

  constructor() {
    // Effect to update grid columns when breakpoint changes
    effect(() => {
      const api = this.gridApi();
      const columns = this.activeColumns();
      if (api) {
        api.setGridOption('columnDefs', columns);
      }
    });
  }

  onGridReady(event: GridReadyEvent<CustomerOrder>): void {
    this.gridApi.set(event.api);
  }

  // Desktop: All columns
  private getDesktopColumns(): ColDef<CustomerOrder>[] {
    return [
      { field: 'id', headerName: 'Order ID', width: 110 },
      { field: 'customer', headerName: 'Customer', minWidth: 150 },
      { field: 'email', headerName: 'Email', minWidth: 180 },
      { field: 'product', headerName: 'Product', minWidth: 180 },
      { field: 'category', headerName: 'Category', width: 120 },
      {
        field: 'quantity',
        headerName: 'Qty',
        width: 80,
        type: 'numericColumn',
      },
      {
        field: 'total',
        headerName: 'Total',
        width: 110,
        valueFormatter: (params) =>
          params.value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        cellStyle: (params) => {
          const colors: Record<string, { bg: string; text: string }> = {
            Delivered: { bg: '#14532d40', text: '#4ade80' },
            Shipped: { bg: '#1e3a5f40', text: '#60a5fa' },
            Processing: { bg: '#78350f40', text: '#fbbf24' },
            Pending: { bg: '#3f3f4640', text: '#a1a1aa' },
          };
          const style = colors[params.value];
          return style ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' } : null;
        },
      },
      { field: 'orderDate', headerName: 'Date', width: 110 },
      { field: 'region', headerName: 'Region', width: 130 },
    ];
  }

  // Tablet: Essential columns + View button
  private getTabletColumns(): ColDef<CustomerOrder>[] {
    return [
      { field: 'id', headerName: 'Order', width: 100 },
      { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 120 },
      {
        field: 'total',
        headerName: 'Total',
        width: 100,
        valueFormatter: (params) =>
          params.value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        cellStyle: (params) => {
          const colors: Record<string, { bg: string; text: string }> = {
            Delivered: { bg: '#14532d40', text: '#4ade80' },
            Shipped: { bg: '#1e3a5f40', text: '#60a5fa' },
            Processing: { bg: '#78350f40', text: '#fbbf24' },
            Pending: { bg: '#3f3f4640', text: '#a1a1aa' },
          };
          const style = colors[params.value];
          return style ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' } : null;
        },
      },
      this.getViewDetailsColumn(),
    ];
  }

  // Mobile: Minimal columns + View button
  private getMobileColumns(): ColDef<CustomerOrder>[] {
    return [
      { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 100 },
      {
        field: 'total',
        headerName: 'Total',
        width: 90,
        valueFormatter: (params) =>
          params.value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '',
      },
      this.getViewDetailsColumn(),
    ];
  }

  // Reusable "View" column for mobile/tablet
  private getViewDetailsColumn(): ColDef<CustomerOrder> {
    return {
      headerName: '',
      width: 70,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<CustomerOrder>) => `
        <button 
          class="px-2 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 
                 bg-purple-500/10 hover:bg-purple-500/20 rounded transition-colors"
          data-action="view-details"
        >
          View
        </button>
      `,
      onCellClicked: (params: CellClickedEvent<CustomerOrder>) => {
        const target = params.event?.target as HTMLElement;
        if (target?.closest('[data-action="view-details"]') && params.data) {
          this.openDetailsSheet(params.data);
        }
      },
    };
  }

  private openDetailsSheet(rowData: CustomerOrder): void {
    this.bottomSheet.open(RowDetailsSheetComponent, { data: rowData });
  }

  protected getBreakpointClasses(): string {
    const bp = this.currentBreakpoint();
    if (bp === 'mobile') return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    if (bp === 'tablet') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }

  protected getBreakpointDescription(): string {
    const bp = this.currentBreakpoint();
    if (bp === 'mobile') return '2 columns + View button';
    if (bp === 'tablet') return '4 columns + View button';
    return 'All 10 columns visible';
  }
}
