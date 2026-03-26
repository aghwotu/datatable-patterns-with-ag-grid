import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  GridApi,
  GridReadyEvent,
  ColDef,
  ColGroupDef,
  SelectionChangedEvent,
  RowClickedEvent,
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
import { BottomSheetService } from '@shared/components/bottom-sheet/bottom-sheet.service';
import { RowDetailsSheetComponent } from '@shared/components/bottom-sheet/row-details-sheet.component';

// Feature toggle interface
interface FeatureToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'interaction' | 'display' | 'layout';
  complexity: 'low' | 'medium' | 'high';
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
        class="relative overflow-hidden bg-linear-to-br from-cyan-500 via-blue-600 to-violet-700"
        style="view-transition-name: demo-preview-feature-explorer"
      >
        <div
          class="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent"
        ></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1
            class="text-2xl sm:text-3xl font-bold text-white mb-2"
            style="view-transition-name: demo-title-feature-explorer"
          >
            Feature Explorer
          </h1>
          <p class="text-sm sm:text-base text-zinc-300/80 max-w-2xl leading-relaxed">
            Toggle AG-Grid features in isolation to evaluate their UX trade-offs. See how
            combinations affect readability, interaction cost, and maintainability.
          </p>
        </div>
      </div>

      <!-- Main Content: Sidebar + Grid -->
      <div class="flex-1 flex flex-col lg:flex-row w-full">
        <!-- Sidebar: Feature Panel -->
        <aside
          class="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800/50 flex flex-col"
        >
          <!-- Panel Header -->
          <div class="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 border-b border-zinc-800/40">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Features
              </h2>
              <div class="flex gap-1">
                <button
                  (click)="enableAll()"
                  [disabled]="allEnabled()"
                  class="px-2 py-1 text-xs font-medium rounded transition-colors"
                  [class]="
                    allEnabled()
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
                  "
                >
                  All On
                </button>
                <button
                  (click)="disableAll()"
                  [disabled]="allDisabled()"
                  class="px-2 py-1 text-xs font-medium rounded transition-colors"
                  [class]="
                    allDisabled()
                      ? 'bg-rose-500 text-white cursor-default'
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
                  "
                >
                  All Off
                </button>
              </div>
            </div>
            <!-- Complexity Meter -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs text-zinc-500">Complexity</span>
                <span
                  class="text-xs font-mono"
                  [class]="
                    complexityScore().percent > 66
                      ? 'text-rose-400'
                      : complexityScore().percent > 33
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  "
                  >{{ complexityScore().score }}/{{ complexityScore().max }}</span
                >
              </div>
              <div class="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="complexityScore().percent"
                  [class]="
                    complexityScore().percent > 66
                      ? 'bg-rose-500'
                      : complexityScore().percent > 33
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                  "
                ></div>
              </div>
            </div>
          </div>

          <!-- Feature Groups (horizontal scroll on mobile, vertical on lg) -->
          <div
            class="overflow-x-auto lg:overflow-x-visible overflow-y-visible lg:overflow-y-auto flex-1"
          >
            <div class="flex lg:flex-col gap-5 p-4 sm:p-5">
              @for (group of featuresGrouped(); track group.id) {
                <div class="shrink-0 lg:shrink min-w-52 lg:min-w-0">
                  <div class="flex items-center gap-2 mb-2 px-1">
                    <span
                      class="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest"
                      >{{ group.label }}</span
                    >
                    <div class="flex-1 h-px bg-zinc-800/60"></div>
                  </div>
                  <div class="space-y-1">
                    @for (feature of group.features; track feature.id) {
                      <div
                        class="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all"
                        [class]="
                          feature.enabled
                            ? 'bg-cyan-500/6 border-cyan-500/20'
                            : 'border-transparent hover:bg-zinc-800/40'
                        "
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1.5 mb-0.5">
                            <span
                              class="text-sm font-medium leading-tight"
                              [class]="feature.enabled ? 'text-zinc-100' : 'text-zinc-400'"
                              >{{ feature.label }}</span
                            >
                            <span
                              class="shrink-0 px-1.5 py-px rounded text-[10px] font-semibold leading-tight"
                              [class]="
                                feature.complexity === 'high'
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : feature.complexity === 'medium'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                              "
                              >{{ feature.complexity }}</span
                            >
                          </div>
                          <p class="text-[11px] text-zinc-600 leading-tight">
                            {{ feature.description }}
                          </p>
                        </div>
                        <app-toggle-switch
                          [checked]="feature.enabled"
                          (checkedChange)="onFeatureToggle(feature.id, $event)"
                        />
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Panel Footer -->
          <div class="px-4 sm:px-5 py-3 border-t border-zinc-800/40">
            <p class="text-xs text-zinc-600">
              <span class="text-cyan-400 font-semibold">{{ enabledFeatures().length }}</span>
              of {{ features().length }} features active
            </p>
          </div>
        </aside>

        <!-- Main Grid Area -->
        <main class="flex-1 flex flex-col p-4 sm:p-6 min-w-0">
          <!-- Toolbar: Search + Filters + Controls -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <!-- Left: Search + Filters + Reset -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Global Search -->
              <div class="relative">
                <svg
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
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
                  placeholder="Search tasks..."
                  class="w-full sm:w-52 pl-8 pr-8 py-1.5 text-sm bg-zinc-900/60 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-colors"
                  [value]="searchInputValue()"
                  (input)="onSearchInput($event)"
                />
                @if (searchInputValue()) {
                  <button
                    type="button"
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    (click)="clearSearch()"
                    title="Clear search"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                }
              </div>

              @if (isFeatureEnabled('floatingFilters')) {
                <app-dropdown-menu
                  [label]="statusFilter() || 'Status'"
                  [items]="statusOptions"
                  (itemSelected)="onStatusFilter($event)"
                  [size]="'sm'"
                  [variant]="'outline'"
                  [menuWidth]="'w-36'"
                />
                <app-dropdown-menu
                  [label]="priorityFilter() || 'Priority'"
                  [items]="priorityOptions"
                  (itemSelected)="onPriorityFilter($event)"
                  [size]="'sm'"
                  [variant]="'outline'"
                  [menuWidth]="'w-36'"
                />
              }

              <!-- Reset Button -->
              <button
                type="button"
                class="p-1.5 rounded-lg transition-colors border"
                [class]="
                  hasActiveFilters()
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400'
                "
                (click)="resetTable()"
                [title]="hasActiveFilters() ? 'Reset filters and selection' : 'Nothing to reset'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <!-- Right: Selection + Row count + Column visibility -->
            <div class="flex items-center gap-3">
              @if (isFeatureEnabled('rowSelection') && selectedCount() > 0) {
                <div class="flex items-center gap-2">
                  <span class="text-sm text-zinc-400">{{ selectedCount() }} selected</span>
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    (click)="exportSelected()"
                  >
                    Export CSV
                  </button>
                </div>
              }
              <span class="text-sm text-zinc-500">
                <span class="text-zinc-200 font-medium">{{ filteredData().length }}</span> tasks
              </span>
              @if (isFeatureEnabled('columnVisibility') && gridApi() && !isMobile()) {
                <app-column-visibility-menu
                  [gridApi]="gridApi()!"
                  [columnDefs]="activeColumnDefs()"
                  [excludeFields]="['select', 'actions']"
                  (columnVisibilityChanged)="onColumnVisibilityChanged($event)"
                  [size]="'sm'"
                  [variant]="'outline'"
                />
              }
            </div>
          </div>

          <!-- Mobile hint -->
          @if (isMobile()) {
            <div
              class="mb-3 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300"
            >
              Tap a row to view details
            </div>
          }

          <!-- AG-Grid -->
          <div
            class="flex-1 flex flex-col bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden min-h-100 sm:min-h-125"
          >
            <div class="flex-1 min-h-0 w-full overflow-x-auto">
              <ag-grid-angular
                class="ag-theme-quartz-dark w-full h-full"
                [style.minHeight.px]="400"
                [style.minWidth.px]="isMobile() ? 600 : undefined"
                [theme]="theme"
                [rowData]="filteredData()"
                [columnDefs]="activeColumnDefs()"
                [defaultColDef]="defaultColDef"
                [animateRows]="true"
                [pagination]="isFeatureEnabled('pagination')"
                [paginationPageSize]="10"
                [rowSelection]="isFeatureEnabled('rowSelection') ? 'multiple' : undefined"
                [suppressRowClickSelection]="isFeatureEnabled('rowSelection')"
                (gridReady)="onGridReady($event)"
                (selectionChanged)="onSelectionChanged($event)"
                (rowClicked)="onRowClicked($event)"
              />
            </div>
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
  private breakpointObserver = inject(BreakpointObserver);
  private bottomSheet = inject(BottomSheetService);

  private _gridApi = signal<GridApi<ProjectTask> | null>(null);
  gridApi = this._gridApi.asReadonly();

  // Mobile detection
  isMobile = signal(false);

  // Selection tracking
  selectedCount = signal(0);

  // Feature toggles
  features = signal<FeatureToggle[]>([
    {
      id: 'rowSelection',
      label: 'Row Selection',
      description: 'Checkbox selection + bulk export',
      enabled: true,
      category: 'interaction',
      complexity: 'medium',
    },
    {
      id: 'columnVisibility',
      label: 'Column Control',
      description: 'User-driven column management',
      enabled: true,
      category: 'interaction',
      complexity: 'low',
    },
    {
      id: 'rowActions',
      label: 'Row Actions',
      description: 'Contextual operations per row',
      enabled: true,
      category: 'interaction',
      complexity: 'medium',
    },
    {
      id: 'floatingFilters',
      label: 'Quick Filters',
      description: 'Toolbar-level data filtering',
      enabled: true,
      category: 'interaction',
      complexity: 'low',
    },
    {
      id: 'cellRenderers',
      label: 'Visual Encoding',
      description: 'Badges, progress, trend indicators',
      enabled: true,
      category: 'display',
      complexity: 'medium',
    },
    {
      id: 'statusColors',
      label: 'Status Encoding',
      description: 'Semantic color differentiation',
      enabled: true,
      category: 'display',
      complexity: 'low',
    },
    {
      id: 'groupedColumns',
      label: 'Column Grouping',
      description: 'Hierarchical header organization',
      enabled: false,
      category: 'layout',
      complexity: 'high',
    },
    {
      id: 'pagination',
      label: 'Pagination',
      description: 'Page through large datasets',
      enabled: true,
      category: 'layout',
      complexity: 'low',
    },
  ]);

  // Filters
  statusFilter = signal<string>('');
  priorityFilter = signal<string>('');

  // Global search with debounce
  searchInputValue = signal<string>(''); // Raw input value (what user sees)
  searchText = signal<string>(''); // Debounced value (what filters the grid)
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly SEARCH_DEBOUNCE_MS = 200; // 200ms debounce

  // Check if any filters/search are active (for reset button highlighting)
  hasActiveFilters = computed(() => {
    return (
      this.searchInputValue() !== '' || this.statusFilter() !== '' || this.priorityFilter() !== ''
    );
  });

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
      action: (row) => this.bottomSheet.open(RowDetailsSheetComponent, { data: row }),
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

  private readonly statusColors: Record<string, { bg: string; text: string }> = {
    Completed: { bg: '#14532d40', text: '#4ade80' },
    'In Progress': { bg: '#1e3a5f40', text: '#60a5fa' },
    Pending: { bg: '#78350f40', text: '#fbbf24' },
    Blocked: { bg: '#7f1d1d40', text: '#f87171' },
  };

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

  // Computed filtered data (includes search + dropdown filters)
  filteredData = computed(() => {
    let data = this.rowData;

    // Apply dropdown filters
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

    // Apply search filter (matches AG Grid's quick filter behavior)
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      data = data.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(search)),
      );
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

  featuresGrouped = computed(() => {
    const byCategory = (cat: FeatureToggle['category']) =>
      this.features().filter((f) => f.category === cat);
    return [
      { id: 'interaction', label: 'Interaction', features: byCategory('interaction') },
      { id: 'display', label: 'Display', features: byCategory('display') },
      { id: 'layout', label: 'Layout', features: byCategory('layout') },
    ];
  });

  complexityScore = computed(() => {
    const weight = { low: 1, medium: 2, high: 3 } as const;
    const score = this.features()
      .filter((f) => f.enabled)
      .reduce((acc, f) => acc + weight[f.complexity], 0);
    const max = this.features().reduce((acc, f) => acc + weight[f.complexity], 0);
    return { score, max, percent: max > 0 ? Math.round((score / max) * 100) : 0 };
  });

  constructor() {
    ModuleRegistry.registerModules([AllCommunityModule]);

    // Mobile breakpoint detection
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });

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

  // Selection handling
  onSelectionChanged(event: SelectionChangedEvent<ProjectTask>): void {
    this.selectedCount.set(event.api.getSelectedNodes().length);
  }

  exportSelected(): void {
    const api = this.gridApi();
    if (!api || this.selectedCount() === 0) return;

    api.exportDataAsCsv({
      onlySelected: true,
      fileName: 'selected_tasks.csv',
    });
  }

  // Mobile row click → bottom sheet details
  onRowClicked(event: RowClickedEvent<ProjectTask>): void {
    // Only open bottom sheet on mobile
    if (!this.isMobile() || !event.data) return;

    this.bottomSheet.open(RowDetailsSheetComponent, { data: event.data });
  }

  isFeatureEnabled(featureId: string): boolean {
    return this.features().find((f) => f.id === featureId)?.enabled ?? false;
  }

  onFeatureToggle(featureId: string, enabled: boolean): void {
    this.features.update((features) =>
      features.map((f) => (f.id === featureId ? { ...f, enabled } : f)),
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

  onColumnVisibilityChanged(_event: { field: string; visible: boolean }): void {
    // Column visibility is handled by the menu component directly
  }

  // Search handling with debounce
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Update input value immediately (for responsive UI)
    this.searchInputValue.set(value);

    // Clear existing timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Debounce the actual filter update
    this.searchDebounceTimer = setTimeout(() => {
      this.searchText.set(value);
      this.searchDebounceTimer = null;
    }, this.SEARCH_DEBOUNCE_MS);
  }

  clearSearch(): void {
    // Clear any pending debounce
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
    // Clear both immediately
    this.searchInputValue.set('');
    this.searchText.set('');
  }

  // Reset table to default state
  resetTable(): void {
    // Clear search (including any pending debounce)
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
    this.searchInputValue.set('');
    this.searchText.set('');

    // Clear filters
    this.statusFilter.set('');
    this.priorityFilter.set('');

    // Clear selection
    const api = this.gridApi();
    if (api) {
      api.deselectAll();
    }
    this.selectedCount.set(0);

    // Reset to first page if pagination is enabled
    if (api && this.isFeatureEnabled('pagination')) {
      api.paginationGoToFirstPage();
    }
  }

  // Flat column definitions (no grouping)
  private getFlatColumnDefs(): ColDef<ProjectTask>[] {
    const columns: ColDef<ProjectTask>[] = [];

    // Checkbox selection column
    if (this.isFeatureEnabled('rowSelection')) {
      columns.push({
        headerName: '',
        colId: 'select',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 44,
        maxWidth: 52,
        pinned: 'left',
        suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
      });
    }

    columns.push(
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Task', minWidth: 150 },
      { field: 'assignee', headerName: 'Assignee', width: 130 },
      { field: 'effort', headerName: 'Effort', width: 90, valueFormatter: (p) => `${p.value}h` },
    );

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
        if (!this.isFeatureEnabled('statusColors')) return null;
        const style = this.statusColors[params.value];
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
      { field: 'category', headerName: 'Category', width: 100, hide: true },
      { field: 'dueDate', headerName: 'Due Date', width: 110 },
      {
        field: 'budget',
        headerName: 'Budget',
        width: 100,
        valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
        hide: true,
      },
      {
        field: 'spent',
        headerName: 'Spent',
        width: 100,
        valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
        hide: true,
      },
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
        valueFormatter: (params) => `${params.value > 0 ? '+' : ''}${params.value}%`,
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
    const columns: (ColDef<ProjectTask> | ColGroupDef<ProjectTask>)[] = [];

    // Checkbox selection column
    if (this.isFeatureEnabled('rowSelection')) {
      columns.push({
        headerName: '',
        colId: 'select',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 44,
        maxWidth: 52,
        pinned: 'left',
        suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
      });
    }

    columns.push(
      { field: 'id', headerName: 'ID', width: 100 },
      {
        headerName: 'Task Info',
        children: [
          { field: 'title', headerName: 'Task', minWidth: 150 },
          { field: 'assignee', headerName: 'Assignee', width: 130 },
          {
            field: 'effort',
            headerName: 'Effort',
            width: 90,
            valueFormatter: (p) => `${p.value}h`,
          },
          { field: 'category', headerName: 'Category', width: 100, hide: true },
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
              if (!this.isFeatureEnabled('statusColors')) return null;
              const style = this.statusColors[params.value];
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
            hide: true,
          },
          {
            field: 'spent',
            headerName: 'Spent',
            width: 100,
            valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
            hide: true,
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
                valueFormatter: (params) => `${params.value > 0 ? '+' : ''}${params.value}%`,
              },
        ],
      },
      { field: 'dueDate', headerName: 'Due Date', width: 110 },
    );

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
