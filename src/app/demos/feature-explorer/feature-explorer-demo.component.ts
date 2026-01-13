import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  CellClickedEvent,
} from 'ag-grid-community';
import { DemoNavHeaderComponent } from '@shared/components/demo-nav-header/demo-nav-header.component';
import { ColumnVisibilityMenuComponent } from '@shared/menus/column-visibility-menu/column-visibility-menu.component';
import {
  AgGridEllipsisMenuComponent,
  GridAction,
} from '@shared/menus/ag-grid-ellipsis-menu/ag-grid-ellipsis-menu.component';
import { BadgeCellComponent } from '@shared/components/cell-renderers/badge-cell.component';
import { ProgressCellComponent } from '@shared/components/cell-renderers/progress-cell.component';
import { TrendCellComponent } from '@shared/components/cell-renderers/trend-cell.component';
import {
  DropdownMenuComponent,
  DropdownMenuItem,
} from '@shared/menus/dropdown-menu/dropdown-menu.component';

ModuleRegistry.registerModules([AllCommunityModule]);

// Feature toggle interface
interface FeatureToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

// Sample data interface
interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Pending' | 'Blocked';
  progress: number;
  effort: number; // hours
  category: string;
  dueDate: string;
  budget: number;
  spent: number;
  variance: number;
}

// Sample data
const taskData: ProjectTask[] = [
  {
    id: 'TSK-001',
    title: 'API Integration',
    assignee: 'Sarah Chen',
    priority: 'Critical',
    status: 'In Progress',
    progress: 65,
    effort: 40,
    category: 'Backend',
    dueDate: '2026-01-15',
    budget: 5000,
    spent: 3250,
    variance: 1750,
  },
  {
    id: 'TSK-002',
    title: 'Dashboard UI',
    assignee: 'Marcus Lee',
    priority: 'High',
    status: 'In Progress',
    progress: 80,
    effort: 24,
    category: 'Frontend',
    dueDate: '2026-01-12',
    budget: 3000,
    spent: 2400,
    variance: 600,
  },
  {
    id: 'TSK-003',
    title: 'Database Migration',
    assignee: 'Alex Rivera',
    priority: 'Critical',
    status: 'Pending',
    progress: 0,
    effort: 16,
    category: 'Backend',
    dueDate: '2026-01-20',
    budget: 2000,
    spent: 0,
    variance: 2000,
  },
  {
    id: 'TSK-004',
    title: 'User Testing',
    assignee: 'Jordan Kim',
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
    effort: 32,
    category: 'QA',
    dueDate: '2026-01-08',
    budget: 4000,
    spent: 3800,
    variance: 200,
  },
  {
    id: 'TSK-005',
    title: 'Performance Audit',
    assignee: 'Taylor Swift',
    priority: 'High',
    status: 'Blocked',
    progress: 25,
    effort: 20,
    category: 'DevOps',
    dueDate: '2026-01-18',
    budget: 2500,
    spent: 625,
    variance: 1875,
  },
  {
    id: 'TSK-006',
    title: 'Security Review',
    assignee: 'Morgan Davis',
    priority: 'Critical',
    status: 'In Progress',
    progress: 45,
    effort: 28,
    category: 'Security',
    dueDate: '2026-01-14',
    budget: 3500,
    spent: 1575,
    variance: 1925,
  },
  {
    id: 'TSK-007',
    title: 'Documentation',
    assignee: 'Casey Jones',
    priority: 'Low',
    status: 'Pending',
    progress: 10,
    effort: 12,
    category: 'Docs',
    dueDate: '2026-01-25',
    budget: 1500,
    spent: 150,
    variance: 1350,
  },
  {
    id: 'TSK-008',
    title: 'Mobile Responsive',
    assignee: 'Riley Parker',
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
    effort: 18,
    category: 'Frontend',
    dueDate: '2026-01-10',
    budget: 2200,
    spent: 2100,
    variance: 100,
  },
  {
    id: 'TSK-009',
    title: 'CI/CD Pipeline',
    assignee: 'Sam Wilson',
    priority: 'High',
    status: 'In Progress',
    progress: 55,
    effort: 36,
    category: 'DevOps',
    dueDate: '2026-01-16',
    budget: 4500,
    spent: 2475,
    variance: 2025,
  },
  {
    id: 'TSK-010',
    title: 'Analytics Setup',
    assignee: 'Drew Martinez',
    priority: 'Medium',
    status: 'Pending',
    progress: 0,
    effort: 14,
    category: 'Backend',
    dueDate: '2026-01-22',
    budget: 1800,
    spent: 0,
    variance: 1800,
  },
];

@Component({
  selector: 'app-feature-explorer-demo',
  standalone: true,
  imports: [
    FormsModule,
    AgGridAngular,
    DemoNavHeaderComponent,
    ColumnVisibilityMenuComponent,
    DropdownMenuComponent,
  ],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="'feature-explorer'" />

      <!-- Demo Info Banner -->
      <div
        class="bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700 relative"
        style="view-transition-name: demo-preview-feature-explorer"
      >
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-10">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-feature-explorer"
            >
              Feature Explorer
            </h1>
            <p class="text-zinc-200 text-lg mb-5">
              Toggle AG-Grid features on and off to see exactly what each one does.
              A single table showcasing column visibility, row actions, floating filters,
              custom cell renderers, and grouped columns.
            </p>
          </div>
        </div>
      </div>

      <!-- Feature Toggles -->
      <div class="max-w-7xl w-full mx-auto px-6 py-5 border-b border-zinc-800/50">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
            Toggle Features
          </h2>
          <div class="flex gap-2">
            <button
              (click)="enableAll()"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              Enable All
            </button>
            <button
              (click)="disableAll()"
              class="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 transition-colors"
            >
              Disable All
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          @for (feature of features(); track feature.id) {
            <button
              (click)="toggleFeature(feature.id)"
              class="flex flex-col items-start p-3 rounded-xl border transition-all"
              [class]="feature.enabled
                ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'"
            >
              <div class="flex items-center gap-2 w-full mb-1">
                <div
                  class="w-3 h-3 rounded-full transition-colors"
                  [class]="feature.enabled ? 'bg-cyan-400' : 'bg-zinc-600'"
                ></div>
                <span
                  class="text-sm font-medium"
                  [class]="feature.enabled ? 'text-cyan-100' : 'text-zinc-400'"
                >
                  {{ feature.label }}
                </span>
              </div>
              <span class="text-xs text-zinc-500 text-left">{{ feature.description }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Toolbar -->
      <div class="max-w-7xl w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-4">
            <!-- Floating Filter (if enabled) -->
            @if (isFeatureEnabled('floatingFilters')) {
              <div class="flex items-center gap-2">
                <span class="text-xs text-zinc-500">Status:</span>
                <app-dropdown-menu
                  [label]="statusFilter() || 'All'"
                  [items]="statusOptions"
                  (itemSelected)="onStatusFilter($event)"
                  [size]="'sm'"
                  [variant]="'outline'"
                  [menuWidth]="'w-36'"
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-zinc-500">Priority:</span>
                <app-dropdown-menu
                  [label]="priorityFilter() || 'All'"
                  [items]="priorityOptions"
                  (itemSelected)="onPriorityFilter($event)"
                  [size]="'sm'"
                  [variant]="'outline'"
                  [menuWidth]="'w-36'"
                />
              </div>
            }
          </div>

          <div class="flex items-center gap-3">
            <div class="text-sm text-zinc-400">
              <span class="text-zinc-100 font-medium">{{ filteredData().length }}</span> tasks
            </div>
            <!-- Column Visibility (if enabled) -->
            @if (isFeatureEnabled('columnVisibility') && gridApi()) {
              <app-column-visibility-menu
                [gridApi]="gridApi()!"
                (columnVisibilityChanged)="onColumnVisibilityChanged($event)"
                [size]="'sm'"
                [variant]="'outline'"
              />
            }
          </div>
        </div>
      </div>

      <!-- AG-Grid Container -->
      <div class="flex-1 px-6 pb-6">
        <div class="max-w-7xl mx-auto h-full">
          <div
            class="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden h-[500px]"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="filteredData()"
              [columnDefs]="activeColumnDefs()"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [pagination]="true"
              [paginationPageSize]="10"
              (gridReady)="onGridReady($event)"
            />
          </div>
        </div>
      </div>

      <!-- Active Features Summary -->
      <div class="border-t border-zinc-800/50 bg-zinc-900/30">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
            Currently Active Features
          </h3>
          <div class="flex flex-wrap gap-2">
            @for (feature of enabledFeatures(); track feature.id) {
              <span
                class="px-3 py-1.5 text-sm font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
              >
                {{ feature.label }}
              </span>
            }
            @if (enabledFeatures().length === 0) {
              <span class="text-sm text-zinc-500 italic">No features enabled — basic table mode</span>
            }
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
export class FeatureExplorerDemoComponent {
  private _gridApi = signal<GridApi<ProjectTask> | null>(null);
  gridApi = this._gridApi.asReadonly();

  // Feature toggles
  features = signal<FeatureToggle[]>([
    {
      id: 'columnVisibility',
      label: 'Column Visibility',
      description: 'Show/hide columns',
      enabled: true,
    },
    {
      id: 'rowActions',
      label: 'Row Actions',
      description: 'Ellipsis menu per row',
      enabled: true,
    },
    {
      id: 'floatingFilters',
      label: 'Floating Filters',
      description: 'Header dropdowns',
      enabled: true,
    },
    {
      id: 'cellRenderers',
      label: 'Cell Renderers',
      description: 'Badges, progress, etc.',
      enabled: true,
    },
    {
      id: 'groupedColumns',
      label: 'Grouped Columns',
      description: 'Nested headers',
      enabled: false,
    },
    {
      id: 'statusColors',
      label: 'Status Colors',
      description: 'Colored status cells',
      enabled: true,
    },
  ]);

  // Filters
  statusFilter = signal<string>('');
  priorityFilter = signal<string>('');

  statusOptions: DropdownMenuItem<string>[] = [
    { label: 'All', value: '' },
    { label: 'Completed', value: 'Completed' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Blocked', value: 'Blocked' },
  ];

  priorityOptions: DropdownMenuItem<string>[] = [
    { label: 'All', value: '' },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  // Row actions
  private readonly gridActions: GridAction<ProjectTask>[] = [
    {
      label: 'View Details',
      action: (row) => console.log('View:', row.title),
    },
    {
      label: 'Edit Task',
      action: (row) => console.log('Edit:', row.title),
      disabled: (row) => row.status === 'Completed',
    },
    {
      label: 'Mark Complete',
      action: (row) => console.log('Complete:', row.title),
      hidden: (row) => row.status === 'Completed',
    },
    {
      label: 'Archive',
      action: (row) => console.log('Archive:', row.title),
      hidden: (row) => row.status !== 'Completed',
    },
  ];

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

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 80,
    resizable: true,
    sortable: true,
  };

  rowData = taskData;

  // Computed filtered data
  filteredData = computed(() => {
    let data = this.rowData;

    if (this.isFeatureEnabled('floatingFilters')) {
      const status = this.statusFilter();
      const priority = this.priorityFilter();

      if (status) {
        data = data.filter((row) => row.status === status);
      }
      if (priority) {
        data = data.filter((row) => row.priority === priority);
      }
    }

    return data;
  });

  // Computed column definitions based on enabled features
  activeColumnDefs = computed(() => {
    if (this.isFeatureEnabled('groupedColumns')) {
      return this.getGroupedColumnDefs();
    }
    return this.getFlatColumnDefs();
  });

  enabledFeatures = computed(() => this.features().filter((f) => f.enabled));

  constructor() {
    // Effect to update grid when features change
    effect(() => {
      const api = this._gridApi();
      const columns = this.activeColumnDefs();
      if (api) {
        api.setGridOption('columnDefs', columns);
      }
    });
  }

  onGridReady(event: GridReadyEvent<ProjectTask>): void {
    this._gridApi.set(event.api);
  }

  isFeatureEnabled(featureId: string): boolean {
    return this.features().find((f) => f.id === featureId)?.enabled ?? false;
  }

  toggleFeature(featureId: string): void {
    this.features.update((features) =>
      features.map((f) => (f.id === featureId ? { ...f, enabled: !f.enabled } : f))
    );
  }

  enableAll(): void {
    this.features.update((features) => features.map((f) => ({ ...f, enabled: true })));
  }

  disableAll(): void {
    this.features.update((features) => features.map((f) => ({ ...f, enabled: false })));
  }

  onStatusFilter(value: string): void {
    this.statusFilter.set(value);
  }

  onPriorityFilter(value: string): void {
    this.priorityFilter.set(value);
  }

  onColumnVisibilityChanged(event: { field: string; visible: boolean }): void {
    // Column visibility is handled by the menu component directly
  }

  // Flat column definitions (no grouping)
  private getFlatColumnDefs(): ColDef<ProjectTask>[] {
    const columns: ColDef<ProjectTask>[] = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Task', minWidth: 150 },
      { field: 'assignee', headerName: 'Assignee', width: 130 },
    ];

    // Priority with badge renderer
    if (this.isFeatureEnabled('cellRenderers')) {
      columns.push({
        field: 'priority',
        headerName: 'Priority',
        width: 120,
        cellRenderer: BadgeCellComponent,
      });
    } else {
      columns.push({ field: 'priority', headerName: 'Priority', width: 100 });
    }

    // Status with colors
    const statusColumn: ColDef<ProjectTask> = {
      field: 'status',
      headerName: 'Status',
      width: 120,
    };

    if (this.isFeatureEnabled('statusColors')) {
      statusColumn.cellStyle = (params) => {
        const colors: Record<string, { bg: string; text: string }> = {
          Completed: { bg: '#14532d40', text: '#4ade80' },
          'In Progress': { bg: '#1e3a5f40', text: '#60a5fa' },
          Pending: { bg: '#78350f40', text: '#fbbf24' },
          Blocked: { bg: '#7f1d1d40', text: '#f87171' },
        };
        const style = colors[params.value];
        return style ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' } : null;
      };
    }
    columns.push(statusColumn);

    // Progress with renderer
    if (this.isFeatureEnabled('cellRenderers')) {
      columns.push({
        field: 'progress',
        headerName: 'Progress',
        width: 150,
        cellRenderer: ProgressCellComponent,
      });
    } else {
      columns.push({
        field: 'progress',
        headerName: 'Progress',
        width: 100,
        valueFormatter: (params) => `${params.value}%`,
      });
    }

    columns.push(
      { field: 'category', headerName: 'Category', width: 100 },
      { field: 'dueDate', headerName: 'Due Date', width: 110 },
      {
        field: 'budget',
        headerName: 'Budget',
        width: 100,
        valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
      }
    );

    // Variance with trend renderer
    if (this.isFeatureEnabled('cellRenderers')) {
      columns.push({
        field: 'variance',
        headerName: 'Variance',
        width: 110,
        cellRenderer: TrendCellComponent,
      });
    } else {
      columns.push({
        field: 'variance',
        headerName: 'Variance',
        width: 100,
        valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
      });
    }

    // Row actions
    if (this.isFeatureEnabled('rowActions')) {
      columns.push({
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
      });
    }

    return columns;
  }

  // Grouped column definitions
  private getGroupedColumnDefs(): (ColDef<ProjectTask> | ColGroupDef<ProjectTask>)[] {
    const columns: (ColDef<ProjectTask> | ColGroupDef<ProjectTask>)[] = [
      { field: 'id', headerName: 'ID', width: 100 },
      {
        headerName: 'Task Info',
        children: [
          { field: 'title', headerName: 'Task', minWidth: 150 },
          { field: 'assignee', headerName: 'Assignee', width: 130 },
          { field: 'category', headerName: 'Category', width: 100 },
        ],
      },
      {
        headerName: 'Status',
        children: [
          this.isFeatureEnabled('cellRenderers')
            ? {
                field: 'priority',
                headerName: 'Priority',
                width: 120,
                cellRenderer: BadgeCellComponent,
              }
            : { field: 'priority', headerName: 'Priority', width: 100 },
          {
            field: 'status',
            headerName: 'Status',
            width: 120,
            cellStyle: this.isFeatureEnabled('statusColors')
              ? (params) => {
                  const colors: Record<string, { bg: string; text: string }> = {
                    Completed: { bg: '#14532d40', text: '#4ade80' },
                    'In Progress': { bg: '#1e3a5f40', text: '#60a5fa' },
                    Pending: { bg: '#78350f40', text: '#fbbf24' },
                    Blocked: { bg: '#7f1d1d40', text: '#f87171' },
                  };
                  const style = colors[params.value];
                  return style
                    ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' }
                    : null;
                }
              : undefined,
          },
          this.isFeatureEnabled('cellRenderers')
            ? {
                field: 'progress',
                headerName: 'Progress',
                width: 150,
                cellRenderer: ProgressCellComponent,
              }
            : {
                field: 'progress',
                headerName: 'Progress',
                width: 100,
                valueFormatter: (params) => `${params.value}%`,
              },
        ],
      },
      {
        headerName: 'Budget',
        children: [
          {
            field: 'budget',
            headerName: 'Budget',
            width: 100,
            valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
          },
          {
            field: 'spent',
            headerName: 'Spent',
            width: 100,
            valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
          },
          this.isFeatureEnabled('cellRenderers')
            ? {
                field: 'variance',
                headerName: 'Variance',
                width: 110,
                cellRenderer: TrendCellComponent,
              }
            : {
                field: 'variance',
                headerName: 'Variance',
                width: 100,
                valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
              },
        ],
      },
      { field: 'dueDate', headerName: 'Due Date', width: 110 },
    ];

    // Row actions
    if (this.isFeatureEnabled('rowActions')) {
      columns.push({
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
      });
    }

    return columns;
  }
}
