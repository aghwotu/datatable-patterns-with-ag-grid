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
import { AvatarCellComponent } from './renderers/avatar-cell.component';
import { ProgressCellComponent } from './renderers/progress-cell.component';
import { BadgeCellComponent } from './renderers/badge-cell.component';
import { TrendCellComponent } from './renderers/trend-cell.component';
import { CurrencyCellComponent } from './renderers/currency-cell.component';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface PortfolioClient {
  id: string;
  name: string;
  email: string;
  accountType: string;
  portfolioValue: number;
  riskLevel: string;
  allocation: number;
  ytdReturn: number;
  priority: string;
  lastContact: string;
}

const clientData: PortfolioClient[] = [
  {
    id: 'CLT001',
    name: 'Alexandra Chen',
    email: 'a.chen@acmecorp.com',
    accountType: 'Premium',
    portfolioValue: 2450000,
    riskLevel: 'Medium Risk',
    allocation: 85,
    ytdReturn: 12.4,
    priority: 'High',
    lastContact: '2026-01-08',
  },
  {
    id: 'CLT002',
    name: 'Marcus Williams',
    email: 'm.williams@techstart.io',
    accountType: 'Business',
    portfolioValue: 875000,
    riskLevel: 'High Risk',
    allocation: 72,
    ytdReturn: -3.2,
    priority: 'Critical',
    lastContact: '2026-01-07',
  },
  {
    id: 'CLT003',
    name: 'Sarah Johnson',
    email: 's.johnson@globalfin.com',
    accountType: 'Premium',
    portfolioValue: 5200000,
    riskLevel: 'Low Risk',
    allocation: 95,
    ytdReturn: 8.7,
    priority: 'Medium',
    lastContact: '2026-01-06',
  },
  {
    id: 'CLT004',
    name: 'David Park',
    email: 'd.park@investwise.net',
    accountType: 'Standard',
    portfolioValue: 125000,
    riskLevel: 'Medium Risk',
    allocation: 45,
    ytdReturn: 5.1,
    priority: 'Low',
    lastContact: '2026-01-05',
  },
  {
    id: 'CLT005',
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@mediagiant.co',
    accountType: 'Business',
    portfolioValue: 1850000,
    riskLevel: 'High Risk',
    allocation: 88,
    ytdReturn: 18.9,
    priority: 'High',
    lastContact: '2026-01-08',
  },
  {
    id: 'CLT006',
    name: 'James Thompson',
    email: 'j.thompson@lawfirm.legal',
    accountType: 'Premium',
    portfolioValue: 3100000,
    riskLevel: 'Low Risk',
    allocation: 92,
    ytdReturn: 6.3,
    priority: 'Medium',
    lastContact: '2026-01-04',
  },
  {
    id: 'CLT007',
    name: 'Lisa Zhang',
    email: 'l.zhang@biotech.science',
    accountType: 'Business',
    portfolioValue: 950000,
    riskLevel: 'High Risk',
    allocation: 67,
    ytdReturn: -8.5,
    priority: 'Critical',
    lastContact: '2026-01-08',
  },
  {
    id: 'CLT008',
    name: 'Michael Brown',
    email: 'm.brown@retailking.com',
    accountType: 'Standard',
    portfolioValue: 78000,
    riskLevel: 'Low Risk',
    allocation: 35,
    ytdReturn: 2.1,
    priority: 'Low',
    lastContact: '2026-01-02',
  },
  {
    id: 'CLT009',
    name: 'Jennifer Davis',
    email: 'j.davis@healthplus.org',
    accountType: 'Premium',
    portfolioValue: 4500000,
    riskLevel: 'Medium Risk',
    allocation: 78,
    ytdReturn: 10.2,
    priority: 'High',
    lastContact: '2026-01-07',
  },
  {
    id: 'CLT010',
    name: 'Robert Kim',
    email: 'r.kim@energyco.power',
    accountType: 'Business',
    portfolioValue: 1200000,
    riskLevel: 'Medium Risk',
    allocation: 82,
    ytdReturn: 0.0,
    priority: 'Medium',
    lastContact: '2026-01-06',
  },
  {
    id: 'CLT011',
    name: 'Amanda Foster',
    email: 'a.foster@designstudio.art',
    accountType: 'Standard',
    portfolioValue: 45000,
    riskLevel: 'High Risk',
    allocation: 28,
    ytdReturn: -12.3,
    priority: 'Critical',
    lastContact: '2026-01-08',
  },
  {
    id: 'CLT012',
    name: 'Christopher Lee',
    email: 'c.lee@automakers.drive',
    accountType: 'Premium',
    portfolioValue: 6800000,
    riskLevel: 'Low Risk',
    allocation: 98,
    ytdReturn: 15.7,
    priority: 'High',
    lastContact: '2026-01-08',
  },
];

@Component({
  selector: 'app-custom-cell-renderers-demo',
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
        class="bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700 relative"
        style="view-transition-name: demo-preview-custom-cell-renderers"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-custom-cell-renderers"
            >Custom Cell Renderers</h1>
            <p class="text-zinc-200 text-lg mb-5">
              Rich visual components inside AG-Grid cells. Each column showcases a different custom
              renderer: avatars with initials, progress bars, badges with icons, trend indicators,
              and formatted currency.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                ICellRendererAngularComp
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Visual Cells
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Rich Data Display
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Bar -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="text-sm text-zinc-400">
          <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> portfolio clients •
          <span class="text-zinc-500"
            >5 custom cell renderers: Avatar, Progress, Badge, Trend, Currency</span
          >
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
              [rowHeight]="56"
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
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">Custom Renderers Used</h3>
          <div class="grid md:grid-cols-5 gap-4 text-sm text-zinc-400">
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Avatar Cell</h4>
              <p>Shows initials with hash-based colors, supports images and secondary text.</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Progress Cell</h4>
              <p>Animated progress bar with color coding based on percentage thresholds.</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Badge Cell</h4>
              <p>Configurable badges with icons for status, priority, and account types.</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Trend Cell</h4>
              <p>Up/down arrows with percentage, color-coded for positive/negative values.</p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Currency Cell</h4>
              <p>Formatted currency with conditional highlighting for high-value accounts.</p>
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
export class CustomCellRenderersDemoComponent {
  gridApi = signal<GridApi<PortfolioClient> | null>(null);

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#831843',
    accentColor: '#ec4899',
  });

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  rowData = clientData;

  columnDefs: ColDef<PortfolioClient>[] = [
    {
      field: 'name',
      headerName: 'Client',
      minWidth: 220,
      cellRenderer: AvatarCellComponent,
      cellRendererParams: {
        nameField: 'name',
        emailField: 'email',
      },
    },
    {
      field: 'accountType',
      headerName: 'Account',
      width: 130,
      cellRenderer: BadgeCellComponent,
    },
    {
      field: 'portfolioValue',
      headerName: 'Portfolio Value',
      width: 140,
      cellRenderer: CurrencyCellComponent,
    },
    {
      field: 'allocation',
      headerName: 'Allocation',
      width: 150,
      cellRenderer: ProgressCellComponent,
    },
    {
      field: 'ytdReturn',
      headerName: 'YTD Return',
      width: 120,
      cellRenderer: TrendCellComponent,
    },
    {
      field: 'riskLevel',
      headerName: 'Risk',
      width: 130,
      cellRenderer: BadgeCellComponent,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      cellRenderer: BadgeCellComponent,
    },
    {
      field: 'lastContact',
      headerName: 'Last Contact',
      width: 120,
    },
  ];

  onGridReady(event: GridReadyEvent<PortfolioClient>): void {
    this.gridApi.set(event.api);
  }
}
