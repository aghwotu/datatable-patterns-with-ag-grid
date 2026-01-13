import { Component, computed, effect, signal } from '@angular/core';
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
import { ToggleSwitchComponent } from '@shared/components/toggle-switch/toggle-switch.component';

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
  effort: number;
  category: string;
  dueDate: string;
  budget: number;
  spent: number;
  variance: number;
}

// Sample data - variance represents % budget remaining (positive = under budget)
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
    variance: 8.5,
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
    variance: -3.2,
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
    variance: 0,
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
    variance: 5.0,
  },
  {
    id: 'TSK-005',
    title: 'Performance Audit',
    assignee: 'Taylor Morgan',
    priority: 'High',
    status: 'Blocked',
    progress: 25,
    effort: 20,
    category: 'DevOps',
    dueDate: '2026-01-18',
    budget: 2500,
    spent: 625,
    variance: -12.4,
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
    variance: 4.2,
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
    variance: 0,
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
    variance: 4.5,
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
    variance: -7.8,
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
    variance: 0,
  },
  {
    id: 'TSK-011',
    title: 'Email Notifications',
    assignee: 'Jamie Scott',
    priority: 'High',
    status: 'In Progress',
    progress: 70,
    effort: 22,
    category: 'Backend',
    dueDate: '2026-01-17',
    budget: 2800,
    spent: 1960,
    variance: 2.1,
  },
  {
    id: 'TSK-012',
    title: 'Data Export Feature',
    assignee: 'Avery Thompson',
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
    effort: 16,
    category: 'Frontend',
    dueDate: '2026-01-09',
    budget: 2000,
    spent: 1850,
    variance: 7.5,
  },
  {
    id: 'TSK-013',
    title: 'User Permissions',
    assignee: 'Quinn Edwards',
    priority: 'Critical',
    status: 'In Progress',
    progress: 40,
    effort: 30,
    category: 'Security',
    dueDate: '2026-01-19',
    budget: 3800,
    spent: 1520,
    variance: -5.3,
  },
  {
    id: 'TSK-014',
    title: 'Search Optimization',
    assignee: 'Blake Foster',
    priority: 'High',
    status: 'Pending',
    progress: 15,
    effort: 18,
    category: 'Backend',
    dueDate: '2026-01-24',
    budget: 2200,
    spent: 330,
    variance: 0,
  },
  {
    id: 'TSK-015',
    title: 'Accessibility Audit',
    assignee: 'Reese Campbell',
    priority: 'Medium',
    status: 'Blocked',
    progress: 30,
    effort: 24,
    category: 'QA',
    dueDate: '2026-01-21',
    budget: 3000,
    spent: 900,
    variance: -9.2,
  },
  {
    id: 'TSK-016',
    title: 'Load Testing',
    assignee: 'Skyler Brooks',
    priority: 'High',
    status: 'In Progress',
    progress: 50,
    effort: 20,
    category: 'DevOps',
    dueDate: '2026-01-18',
    budget: 2500,
    spent: 1250,
    variance: 3.6,
  },
  {
    id: 'TSK-017',
    title: 'Dark Mode Theme',
    assignee: 'Peyton Reed',
    priority: 'Low',
    status: 'Completed',
    progress: 100,
    effort: 10,
    category: 'Frontend',
    dueDate: '2026-01-11',
    budget: 1200,
    spent: 1100,
    variance: 8.3,
  },
  {
    id: 'TSK-018',
    title: 'API Rate Limiting',
    assignee: 'Morgan Davis',
    priority: 'Critical',
    status: 'Pending',
    progress: 5,
    effort: 26,
    category: 'Security',
    dueDate: '2026-01-23',
    budget: 3200,
    spent: 160,
    variance: 0,
  },
  {
    id: 'TSK-019',
    title: 'Onboarding Flow',
    assignee: 'Jordan Kim',
    priority: 'Medium',
    status: 'In Progress',
    progress: 60,
    effort: 28,
    category: 'Frontend',
    dueDate: '2026-01-20',
    budget: 3500,
    spent: 2100,
    variance: -2.8,
  },
  {
    id: 'TSK-020',
    title: 'Error Logging',
    assignee: 'Alex Rivera',
    priority: 'High',
    status: 'Completed',
    progress: 100,
    effort: 12,
    category: 'DevOps',
    dueDate: '2026-01-13',
    budget: 1500,
    spent: 1450,
    variance: 3.3,
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
    ToggleSwitchComponent,
  ],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="'feature-explorer'" />

      <!-- Hero Section -->
      <div
        class="bg-linear-to-br from-cyan-500 via-blue-600 to-violet-700 relative"
        style="view-transition-name: demo-preview-feature-explorer"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-6 py-10">
          <div class="max-w-3xl">
            <h1
              class="text-3xl md:text-4xl font-bold mb-3 text-white"
              style="view-transition-name: demo-title-feature-explorer"
            >
              Feature Explorer
            </h1>
            <p class="text-zinc-200 text-lg">
              This table isolates common AG-Grid features to make their UX and complexity costs
              visible. The goal is understanding how combinations of features affect readability,
              interaction cost, and maintainability.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content: Sidebar + Grid -->
      <div class="flex-1 flex w-full">
        <!-- Sidebar: Feature Toggles -->
        <aside class="w-72 shrink-0 border-r border-zinc-800/50 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Features</h2>
            <div class="flex gap-1">
              <button
                (click)="enableAll()"
                class="px-2 py-1 text-xs font-medium rounded transition-colors"
                [class]="
                  allEnabled()
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700'
                "
              >
                All On
              </button>
              <button
                (click)="disableAll()"
                class="px-2 py-1 text-xs font-medium rounded transition-colors"
                [class]="
                  allDisabled()
                    ? 'bg-rose-500 text-white cursor-default'
                    : 'bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700'
                "
              >
                All Off
              </button>
            </div>
          </div>

          <!-- Toggle List -->
          <div class="space-y-1">
            @for (feature of features(); track feature.id; let i = $index) {
            <div
              class="flex items-center justify-between py-3 px-3 rounded-lg transition-colors"
              [class]="feature.enabled ? 'bg-cyan-500/5' : 'hover:bg-zinc-800/30'"
            >
              <div class="min-w-0 pr-3">
                <div
                  class="text-sm font-medium truncate"
                  [class]="feature.enabled ? 'text-cyan-100' : 'text-zinc-300'"
                >
                  {{ feature.label }}
                </div>
                <div class="text-xs text-zinc-500 truncate">{{ feature.description }}</div>
              </div>
              <app-toggle-switch
                [(checked)]="features()[i].enabled"
                (checkedChange)="onFeatureToggle(feature.id, $event)"
              />
            </div>
            }
          </div>

          <!-- Active Count -->
          <div class="mt-6 pt-6 border-t border-zinc-800/50">
            <div class="text-xs text-zinc-500">
              <span class="text-cyan-400 font-semibold">{{ enabledFeatures().length }}</span>
              of {{ features().length }} features enabled
            </div>
          </div>
        </aside>

        <!-- Main Grid Area -->
        <main class="flex-1 flex flex-col p-6">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div class="flex items-center gap-4">
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
              @if (isFeatureEnabled('columnVisibility') && gridApi()) {
              <app-column-visibility-menu
                [gridApi]="gridApi()!"
                [columnDefs]="activeColumnDefs()"
                (columnVisibilityChanged)="onColumnVisibilityChanged($event)"
                [size]="'sm'"
                [variant]="'outline'"
              />
              }
            </div>
          </div>

          <!-- AG-Grid -->
          <div
            class="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden min-h-[500px]"
          >
            <ag-grid-angular
              class="w-full h-full"
              [theme]="theme"
              [rowData]="filteredData()"
              [columnDefs]="activeColumnDefs()"
              [defaultColDef]="defaultColDef"
              [animateRows]="true"
              [pagination]="isFeatureEnabled('pagination')"
              [paginationPageSize]="10"
              (gridReady)="onGridReady($event)"
            />
          </div>
        </main>
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
      label: 'Column Control',
      description: 'User-driven column management',
      enabled: true,
    },
    {
      id: 'rowActions',
      label: 'Row Actions',
      description: 'Contextual operations per row',
      enabled: true,
    },
    {
      id: 'floatingFilters',
      label: 'Quick Filters',
      description: 'Toolbar-level data filtering',
      enabled: true,
    },
    {
      id: 'cellRenderers',
      label: 'Visual Encoding',
      description: 'Badges, progress, trend indicators',
      enabled: true,
    },
    {
      id: 'groupedColumns',
      label: 'Column Grouping',
      description: 'Hierarchical header organization',
      enabled: false,
    },
    {
      id: 'statusColors',
      label: 'Status Encoding',
      description: 'Semantic color differentiation',
      enabled: true,
    },
    {
      id: 'pagination',
      label: 'Data Chunking',
      description: 'Paginated data volume control',
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

  // Computed signals for button states
  allEnabled = computed(() => this.features().every((f) => f.enabled));
  allDisabled = computed(() => this.features().every((f) => !f.enabled));

  constructor() {
    // Effect to update grid when features change
    effect(() => {
      const api = this._gridApi();
      const columns = this.activeColumnDefs();
      if (api) {
        api.setGridOption('columnDefs', columns);
        // Force refresh all cells to apply style changes (e.g., status colors)
        // We need to redraw rows to ensure cellStyle functions are re-evaluated
        api.redrawRows();
      }
    });
  }

  onGridReady(event: GridReadyEvent<ProjectTask>): void {
    this._gridApi.set(event.api);
  }

  isFeatureEnabled(featureId: string): boolean {
    return this.features().find((f) => f.id === featureId)?.enabled ?? false;
  }

  onFeatureToggle(featureId: string, enabled: boolean): void {
    this.features.update((features) =>
      features.map((f) => (f.id === featureId ? { ...f, enabled } : f))
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

    // Status with colors - always include cellStyle function that checks feature state
    columns.push({
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellStyle: (params) => {
        if (!this.isFeatureEnabled('statusColors')) {
          return null;
        }
        const colors: Record<string, { bg: string; text: string }> = {
          Completed: { bg: '#14532d40', text: '#4ade80' },
          'In Progress': { bg: '#1e3a5f40', text: '#60a5fa' },
          Pending: { bg: '#78350f40', text: '#fbbf24' },
          Blocked: { bg: '#7f1d1d40', text: '#f87171' },
        };
        const style = colors[params.value];
        return style ? { backgroundColor: style.bg, color: style.text, fontWeight: '500' } : null;
      },
    });

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
            cellStyle: (params) => {
              if (!this.isFeatureEnabled('statusColors')) {
                return null;
              }
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
            },
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
