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
  ColGroupDef,
} from 'ag-grid-community';
import { GroupVisibilityMenuComponent } from './components/group-visibility-menu.component';
import { AvatarCellComponent } from '../custom-cell-renderers/renderers/avatar-cell.component';
import { BadgeCellComponent } from '../custom-cell-renderers/renderers/badge-cell.component';
import { CurrencyCellComponent } from '../custom-cell-renderers/renderers/currency-cell.component';
import { TrendCellComponent } from '../custom-cell-renderers/renderers/trend-cell.component';
import { ProgressCellComponent } from '../custom-cell-renderers/renderers/progress-cell.component';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface PortfolioClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: string;
  status: string;
  tier: string;
  portfolioValue: number;
  ytdReturn: number;
  riskScore: number;
  allocation: number;
  advisor: string;
  joinDate: string;
}

const clientData: PortfolioClient[] = [
  {
    id: 'WM001',
    name: 'Victoria Sterling',
    email: 'v.sterling@sterlingcap.com',
    phone: '+1 (212) 555-0147',
    accountType: 'Premium',
    status: 'Active',
    tier: 'Platinum',
    portfolioValue: 4250000,
    ytdReturn: 14.2,
    riskScore: 65,
    allocation: 88,
    advisor: 'James Chen',
    joinDate: '2019-03-15',
  },
  {
    id: 'WM002',
    name: 'Marcus Blackwell',
    email: 'm.blackwell@blackwell.io',
    phone: '+1 (415) 555-0198',
    accountType: 'Business',
    status: 'Active',
    tier: 'Gold',
    portfolioValue: 1850000,
    ytdReturn: -2.8,
    riskScore: 82,
    allocation: 72,
    advisor: 'Sarah Kim',
    joinDate: '2020-07-22',
  },
  {
    id: 'WM003',
    name: 'Eleanor Vance',
    email: 'e.vance@vancefamily.org',
    phone: '+1 (617) 555-0163',
    accountType: 'Premium',
    status: 'Active',
    tier: 'Platinum',
    portfolioValue: 8750000,
    ytdReturn: 9.5,
    riskScore: 45,
    allocation: 95,
    advisor: 'James Chen',
    joinDate: '2015-11-08',
  },
  {
    id: 'WM004',
    name: 'David Thornton',
    email: 'd.thornton@thorntonllc.com',
    phone: '+1 (312) 555-0142',
    accountType: 'Standard',
    status: 'Under Review',
    tier: 'Silver',
    portfolioValue: 425000,
    ytdReturn: 5.1,
    riskScore: 58,
    allocation: 62,
    advisor: 'Michael Ross',
    joinDate: '2022-01-30',
  },
  {
    id: 'WM005',
    name: 'Sophia Chen',
    email: 's.chen@chenventures.co',
    phone: '+1 (650) 555-0189',
    accountType: 'Business',
    status: 'Active',
    tier: 'Gold',
    portfolioValue: 2100000,
    ytdReturn: 18.7,
    riskScore: 78,
    allocation: 85,
    advisor: 'Sarah Kim',
    joinDate: '2021-04-12',
  },
  {
    id: 'WM006',
    name: 'William Hartford',
    email: 'w.hartford@hartfordest.com',
    phone: '+1 (203) 555-0156',
    accountType: 'Premium',
    status: 'Active',
    tier: 'Platinum',
    portfolioValue: 12500000,
    ytdReturn: 7.3,
    riskScore: 35,
    allocation: 98,
    advisor: 'James Chen',
    joinDate: '2012-09-20',
  },
  {
    id: 'WM007',
    name: 'Isabella Romano',
    email: 'i.romano@romanogroup.it',
    phone: '+1 (305) 555-0171',
    accountType: 'Business',
    status: 'Pending',
    tier: 'Gold',
    portfolioValue: 975000,
    ytdReturn: -5.2,
    riskScore: 88,
    allocation: 55,
    advisor: 'Michael Ross',
    joinDate: '2023-06-05',
  },
  {
    id: 'WM008',
    name: 'Robert Kingsley',
    email: 'r.kingsley@kingsleyinv.com',
    phone: '+1 (404) 555-0134',
    accountType: 'Standard',
    status: 'Active',
    tier: 'Silver',
    portfolioValue: 185000,
    ytdReturn: 3.8,
    riskScore: 52,
    allocation: 45,
    advisor: 'Michael Ross',
    joinDate: '2023-11-18',
  },
  {
    id: 'WM009',
    name: 'Catherine Wells',
    email: 'c.wells@wellsfoundation.org',
    phone: '+1 (202) 555-0128',
    accountType: 'Premium',
    status: 'Active',
    tier: 'Platinum',
    portfolioValue: 6200000,
    ytdReturn: 11.4,
    riskScore: 42,
    allocation: 92,
    advisor: 'James Chen',
    joinDate: '2017-02-14',
  },
  {
    id: 'WM010',
    name: 'Alexander Pierce',
    email: 'a.pierce@piercetech.io',
    phone: '+1 (512) 555-0195',
    accountType: 'Business',
    status: 'Active',
    tier: 'Gold',
    portfolioValue: 3400000,
    ytdReturn: 0.0,
    riskScore: 70,
    allocation: 78,
    advisor: 'Sarah Kim',
    joinDate: '2020-10-03',
  },
];

@Component({
  selector: 'app-grouped-columns-demo',
  imports: [AgGridAngular, RouterLink, GroupVisibilityMenuComponent],
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
      <div class="bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700 relative">
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-12">
          <div class="max-w-3xl">
            <h1 class="text-3xl md:text-4xl font-bold mb-3 text-white">Grouped Column Headers</h1>
            <p class="text-zinc-200 text-lg mb-5">
              Organize related columns under shared headers using AG-Grid's ColGroupDef. Toggle
              entire column groups on/off with the visibility control. Perfect for complex data with
              logical groupings.
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                ColGroupDef
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Group Visibility
              </span>
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
              >
                Nested Headers
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Bar -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-zinc-400">
            <span class="text-zinc-100 font-medium">{{ rowData.length }}</span> wealth management
            clients •
            <span class="text-zinc-500">3 column groups</span>
          </div>
          @if (gridApi()) {
            <app-group-visibility-menu
              [gridApi]="gridApi()!"
              [columnDefs]="columnDefs"
              (columnDefsChange)="onColumnDefsChange($event)"
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
          <h3 class="text-lg font-semibold mb-4 text-zinc-100">Column Groups Explained</h3>
          <div class="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Personal Info</h4>
              <p>
                Client name with avatar, email, and phone number. Uses the
                <code class="text-lime-400">AvatarCellComponent</code> for visual identity.
              </p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Account Details</h4>
              <p>
                Account type (Premium/Business/Standard), status, and client tier badges using
                <code class="text-lime-400">BadgeCellComponent</code>.
              </p>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-4">
              <h4 class="text-zinc-200 font-medium mb-2">Investment Summary</h4>
              <p>
                Portfolio value, YTD return with trend arrows, risk score, and allocation progress
                bar.
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
export class GroupedColumnsDemoComponent {
  gridApi = signal<GridApi<PortfolioClient> | null>(null);

  theme = themeQuartz.withParams({
    backgroundColor: '#18181b',
    foregroundColor: '#fafafa',
    headerBackgroundColor: '#27272a',
    headerTextColor: '#a1a1aa',
    borderColor: '#3f3f46',
    rowHoverColor: '#27272a',
    selectedRowBackgroundColor: '#14532d',
    accentColor: '#84cc16',
  });

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
  };

  rowData = clientData;

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      pinned: 'left',
    },
    {
      groupId: 'personalInfo',
      headerName: 'Personal Info',
      headerClass: 'ag-header-group-cell-label',
      children: [
        {
          field: 'name',
          headerName: 'Client',
          minWidth: 200,
          cellRenderer: AvatarCellComponent,
          cellRendererParams: {
            nameField: 'name',
            emailField: 'email',
          },
        },
        {
          field: 'phone',
          headerName: 'Phone',
          width: 150,
        },
      ],
    },
    {
      groupId: 'accountDetails',
      headerName: 'Account Details',
      children: [
        {
          field: 'accountType',
          headerName: 'Type',
          width: 120,
          cellRenderer: BadgeCellComponent,
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 120,
          cellStyle: (params) => {
            const colors: Record<string, { bg: string; text: string }> = {
              Active: { bg: '#14532d20', text: '#4ade80' },
              Pending: { bg: '#78350f20', text: '#fbbf24' },
              'Under Review': { bg: '#1e3a5f20', text: '#60a5fa' },
            };
            const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
            return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
          },
        },
        {
          field: 'tier',
          headerName: 'Tier',
          width: 110,
          cellStyle: (params) => {
            const colors: Record<string, { bg: string; text: string }> = {
              Platinum: { bg: '#581c8720', text: '#c4b5fd' },
              Gold: { bg: '#78350f20', text: '#fcd34d' },
              Silver: { bg: '#27272a', text: '#a1a1aa' },
            };
            const style = colors[params.value] || { bg: 'transparent', text: '#a1a1aa' };
            return { backgroundColor: style.bg, color: style.text, fontWeight: '500' };
          },
        },
      ],
    },
    {
      groupId: 'investmentSummary',
      headerName: 'Investment Summary',
      children: [
        {
          field: 'portfolioValue',
          headerName: 'Portfolio',
          width: 130,
          cellRenderer: CurrencyCellComponent,
        },
        {
          field: 'ytdReturn',
          headerName: 'YTD Return',
          width: 120,
          cellRenderer: TrendCellComponent,
        },
        {
          field: 'allocation',
          headerName: 'Allocation',
          width: 140,
          cellRenderer: ProgressCellComponent,
        },
      ],
    },
  ];

  onGridReady(event: GridReadyEvent<PortfolioClient>): void {
    this.gridApi.set(event.api);
  }

  onColumnDefsChange(newDefs: (ColDef | ColGroupDef)[]): void {
    this.columnDefs = newDefs;
  }
}
