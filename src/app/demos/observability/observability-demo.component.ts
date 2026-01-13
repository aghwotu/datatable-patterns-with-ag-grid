import { Component, OnInit, OnDestroy, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { ObservabilityApiService, ObservabilityEvent } from './services/observability-api.service';
import { StatusCellComponent } from './renderers/status-cell.component';
import { LatencyCellComponent } from './renderers/latency-cell.component';
import { TimingPhasesCellComponent } from './renderers/timing-phases-cell.component';
import { DemoNavHeaderComponent } from '@shared/components/demo-nav-header/demo-nav-header.component';

// Note: StatusCellComponent and LatencyCellComponent are used as AG Grid cellRenderer references
// in columnDefs, not in the template directly, so they don't need to be in the imports array.

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-observability-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridAngular,
    TimingPhasesCellComponent,
    DemoNavHeaderComponent,
  ],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <app-demo-nav-header [demoId]="'observability'" />

      <div class="flex flex-1 w-full gap-4 px-4 md:px-6 py-6">
        <!-- Filters rail -->
        @if (!controlsHidden()) {
          <aside
            class="hidden lg:flex flex-col w-72 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-4 gap-4 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-zinc-200">Filters</span>
              <button
                class="text-xs text-zinc-400 hover:text-zinc-100 underline decoration-dotted"
                type="button"
                (click)="clearFilters()"
              >
                Clear all
              </button>
            </div>

            <details open class="group">
              <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-zinc-200 py-2">
                Level
              </summary>
              <div class="space-y-2 text-sm">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="accent-emerald-400" [checked]="statusFilters().success" (change)="toggleStatus('success')" />
                  <span class="text-emerald-200">Success (2xx)</span>
                  <span class="text-xs text-zinc-500 ml-auto">{{ statusCounts().success }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="accent-amber-400" [checked]="statusFilters().warning" (change)="toggleStatus('warning')" />
                  <span class="text-amber-200">Warning (4xx)</span>
                  <span class="text-xs text-zinc-500 ml-auto">{{ statusCounts().warning }}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="accent-rose-400" [checked]="statusFilters().error" (change)="toggleStatus('error')" />
                  <span class="text-rose-200">Error (5xx)</span>
                  <span class="text-xs text-zinc-500 ml-auto">{{ statusCounts().error }}</span>
                </label>
              </div>
            </details>

            <details open class="group">
              <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-zinc-200 py-2">
                Method
              </summary>
              <div class="space-y-2 text-sm">
                @for (method of methodCounts() | keyvalue; track method.key) {
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-cyan-400"
                      [checked]="methodFilters().has(method.key)"
                      (change)="toggleMethod(method.key)"
                    />
                    <span class="uppercase text-zinc-100 font-semibold">{{ method.key }}</span>
                    <span class="text-xs text-zinc-500 ml-auto">{{ method.value }}</span>
                  </label>
                }
              </div>
            </details>

            <details open class="group">
              <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-zinc-200 py-2">
                Regions
              </summary>
              <div class="space-y-2 text-sm">
                @for (region of regionCounts() | keyvalue; track region.key) {
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="accent-sky-400"
                      [checked]="regionFilters().has(region.key)"
                      (change)="toggleRegion(region.key)"
                    />
                    <span class="text-zinc-100">{{ region.key }}</span>
                    <span class="text-xs text-zinc-500 ml-auto">{{ region.value }}</span>
                  </label>
                }
              </div>
            </details>

            <details open class="group">
              <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-zinc-200 py-2">
                Latency (ms)
              </summary>
              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <label class="block text-xs text-zinc-500 mb-1">Min</label>
                    <input
                      type="number"
                      class="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100"
                      [value]="latencyRange().min"
                      (input)="updateLatency('min', $any($event.target).valueAsNumber)"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block text-xs text-zinc-500 mb-1">Max</label>
                    <input
                      type="number"
                      class="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100"
                      [value]="latencyRange().max"
                      (input)="updateLatency('max', $any($event.target).valueAsNumber)"
                    />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    class="flex-1 accent-cyan-400"
                    [value]="latencyRange().min"
                    (input)="updateLatency('min', $any($event.target).valueAsNumber)"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    class="flex-1 accent-cyan-400"
                    [value]="latencyRange().max"
                    (input)="updateLatency('max', $any($event.target).valueAsNumber)"
                  />
                </div>
              </div>
            </details>
          </aside>
        }

        <!-- Main column -->
        <div class="flex-1 flex flex-col gap-4">
          <!-- Top controls -->
          <div class="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-3">
            <div class="flex flex-col md:flex-row md:items-center gap-3">
              <div class="relative w-full md:w-96">
                <svg
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="onSearchChange($event)"
                  placeholder="Search data table..."
                  class="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div class="flex-1 flex items-center gap-3 text-sm text-zinc-400">
                <div class="flex items-center gap-2">
                  <span class="text-zinc-200 font-medium">{{ filteredCount() }}</span>
                  <span>of</span>
                  <span class="text-zinc-200 font-medium">{{ totalCount() }}</span>
                  <span>row(s) filtered</span>
                </div>
                <div class="hidden md:flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                    type="button"
                    (click)="toggleControls()"
                  >
                    {{ controlsHidden() ? 'Show Controls' : 'Hide Controls' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-3 text-sm">
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                    type="button"
                    (click)="refreshData()"
                  >
                    Refresh
                  </button>
                  <button
                    class="px-3 py-1.5 rounded-lg border transition-colors"
                    [class.bg-emerald-500/10]="liveMode()"
                    [class.border-emerald-500/60]="liveMode()"
                    [class.text-emerald-100]="liveMode()"
                    [class.bg-zinc-800]="!liveMode()"
                    [class.border-zinc-700]="!liveMode()"
                    [class.text-zinc-200]="!liveMode()"
                    type="button"
                    (click)="toggleLive()"
                  >
                    {{ liveMode() ? 'Live' : 'Go Live' }}
                  </button>
                </div>
                <div class="text-xs text-zinc-500">Timeline (events per day)</div>
              </div>

              <div class="flex items-end gap-2 overflow-x-auto pb-1">
                @for (bucket of timelineBuckets(); track bucket.date) {
                  <div class="flex flex-col items-center gap-1 min-w-[42px]">
                    <div
                      class="w-8 rounded bg-linear-to-t from-cyan-500/40 via-sky-500/50 to-indigo-500/70 border border-cyan-500/30"
                      [style.height]="getTimelineHeight(bucket.count)"
                    ></div>
                    <span class="text-[11px] text-zinc-400">{{ bucket.label }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Grid -->
          <div class="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
            <ag-grid-angular
              class="ag-theme-quartz-dark w-full"
              [style.height.px]="gridHeight"
              [rowData]="rowData()"
              [columnDefs]="columnDefs"
              [defaultColDef]="defaultColDef"
              [rowHeight]="46"
              [headerHeight]="42"
              [animateRows]="true"
              [ensureDomOrder]="true"
              [enableCellTextSelection]="true"
              [rowSelection]="'multiple'"
              [suppressRowClickSelection]="true"
              [rowClassRules]="rowClassRules"
              [theme]="theme"
              [pagination]="true"
              [paginationPageSize]="pageSize()"
              [isExternalFilterPresent]="isExternalFilterPresent"
              [doesExternalFilterPass]="doesExternalFilterPass"
              (gridReady)="onGridReady($event)"
              (filterChanged)="onFilterChanged()"
              (rowClicked)="onRowClicked($event)"
              (paginationChanged)="updatePaginationInfo()"
            />
          </div>

          <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-zinc-400"
          >
            <div class="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                class="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                [value]="pageSize()"
                (change)="onPageSizeChange($any($event.target).valueAsNumber)"
              >
                <option [value]="10">10</option>
                <option [value]="20">20</option>
                <option [value]="50">50</option>
              </select>
            </div>

            <div class="text-zinc-400">{{ paginationText() }}</div>

            <div class="flex items-center gap-1">
              <button
                class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
                (click)="goToPage('first')"
                [disabled]="!canGoPrev()"
              >
                «
              </button>
              <button
                class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
                (click)="goToPage('prev')"
                [disabled]="!canGoPrev()"
              >
                ‹
              </button>
              <button
                class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
                (click)="goToPage('next')"
                [disabled]="!canGoNext()"
              >
                ›
              </button>
              <button
                class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                type="button"
                (click)="goToPage('last')"
                [disabled]="!canGoNext()"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (selectedEvent()) {
      <div
        class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div>
            <div class="text-sm text-zinc-400">Pathname</div>
            <div class="text-lg font-semibold text-zinc-100">{{ selectedEvent()!.pathname }}</div>
          </div>
          <button
            class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
            type="button"
            (click)="closeDrawer()"
          >
            ✕
          </button>
        </div>

        <div class="p-4 space-y-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-xs text-zinc-500">Request ID</div>
              <div class="text-zinc-100 break-all">{{ selectedEvent()!.requestId }}</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Date</div>
              <div class="text-zinc-100">
                {{ selectedEvent()!.timestamp | date: 'medium' }}
              </div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Status</div>
              <div class="text-zinc-100 font-semibold">{{ selectedEvent()!.statusCode }}</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Method</div>
              <div class="text-zinc-100 font-semibold uppercase">{{ selectedEvent()!.method }}</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Host</div>
              <div class="text-zinc-100">{{ selectedEvent()!.host }}</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Region</div>
              <div class="text-zinc-100">{{ selectedEvent()!.region }}</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Latency</div>
              <div class="text-zinc-100 font-semibold">{{ selectedEvent()!.latencyMs }}ms</div>
            </div>
            <div>
              <div class="text-xs text-zinc-500">Percentile</div>
              <div class="text-zinc-100 font-semibold">P{{ selectedEvent()!.percentile }}</div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-xs text-zinc-500">Timing Phases</div>
            <app-timing-phases-cell [value]="selectedEvent()!.timing" />
          </div>

          <div class="space-y-2">
            <div class="text-xs text-zinc-500">Headers</div>
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg text-sm divide-y divide-zinc-800">
              @for (entry of selectedEvent()!.headers | keyvalue; track entry.key) {
                <div class="px-3 py-2 flex items-start gap-2">
                  <div class="text-xs uppercase text-zinc-500 min-w-[90px]">{{ entry.key }}</div>
                  <div class="text-zinc-100 break-all">{{ entry.value }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ObservabilityDemoComponent implements OnInit, OnDestroy {
  private gridApi = signal<GridApi | null>(null);
  rowData = signal<ObservabilityEvent[]>([]);
  totalCount = signal(0);
  filteredCount = signal(0);
  searchTerm = '';
  selectedEvent = signal<ObservabilityEvent | null>(null);
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  gridHeight = 760;

  controlsHidden = signal(false);
  statusFilters = signal<Record<'success' | 'warning' | 'error', boolean>>({
    success: true,
    warning: true,
    error: true,
  });
  methodFilters = signal<Set<string>>(new Set());
  regionFilters = signal<Set<string>>(new Set());
  latencyRange = signal<{ min: number; max: number }>({ min: 0, max: 2000 });
  liveMode = signal(false);
  pageSize = signal(20);
  paginationText = signal('');

  statusCounts = computed(() => {
    const events = this.rowData();
    return {
      success: events.filter((e) => e.level === 'success').length,
      warning: events.filter((e) => e.level === 'warning').length,
      error: events.filter((e) => e.level === 'error').length,
    };
  });

  methodCounts = computed(() => {
    const counts = new Map<string, number>();
    this.rowData().forEach((e) => counts.set(e.method, (counts.get(e.method) ?? 0) + 1));
    return counts;
  });

  regionCounts = computed(() => {
    const counts = new Map<string, number>();
    this.rowData().forEach((e) => counts.set(e.region, (counts.get(e.region) ?? 0) + 1));
    return counts;
  });

  timelineBuckets = computed(() => {
    const buckets = new Map<string, number>();
    this.rowData().forEach((e) => {
      const key = new Date(e.timestamp).toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return Array.from(buckets.entries())
      .map(([date, count]) => ({
        date,
        count,
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  maxTimelineCount = computed(
    () => this.timelineBuckets().reduce((max, b) => Math.max(max, b.count), 1) || 1
  );

  theme = themeQuartz.withParams({
    accentColor: '#22d3ee',
    backgroundColor: '#0b0b10',
    foregroundColor: '#e4e4e7',
    headerBackgroundColor: '#111827',
    rowHoverColor: 'rgba(34, 211, 238, 0.06)',
    borderColor: '#27272a',
  });

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 140,
    suppressHeaderMenuButton: true,
  };

  columnDefs: ColDef<ObservabilityEvent>[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 44,
      maxWidth: 52,
      pinned: 'left',
      suppressMovable: true,
      sortable: false,
      filter: false,
      resizable: false,
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      minWidth: 190,
    },
    {
      field: 'statusCode',
      headerName: 'Status',
      width: 130,
      cellRenderer: StatusCellComponent,
    },
    { field: 'method', headerName: 'Method', width: 100 },
    { field: 'host', headerName: 'Host', minWidth: 180 },
    { field: 'pathname', headerName: 'Pathname', minWidth: 200 },
    {
      field: 'latencyMs',
      headerName: 'Latency',
      width: 120,
      cellRenderer: LatencyCellComponent,
    },
    { field: 'region', headerName: 'Region', minWidth: 160 },
    {
      field: 'timing',
      headerName: 'Timing Phases',
      minWidth: 220,
      sortable: false,
      filter: false,
      cellRenderer: TimingPhasesCellComponent,
    },
  ];

  rowClassRules = {
    'bg-rose-500/10': (params: any) => params.data?.level === 'error',
    'bg-amber-500/10': (params: any) => params.data?.level === 'warning',
  };

  constructor(private api: ObservabilityApiService) {
    effect(() => {
      this.statusFilters();
      this.methodFilters();
      this.regionFilters();
      this.latencyRange();
      this.applyExternalFilter();
    });

    this.search$
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((term) => this.gridApi()?.setGridOption('quickFilterText', term));
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi.set(event.api);
    this.updateCounts();
  }

  onFilterChanged() {
    this.updateCounts();
  }

  onSearchChange(term: string) {
    this.search$.next(term);
  }

  onRowClicked(event: RowClickedEvent<ObservabilityEvent>) {
    this.selectedEvent.set(event.data ?? null);
  }

  closeDrawer() {
    this.selectedEvent.set(null);
  }

  toggleLive() {
    this.liveMode.update((v) => !v);
  }

  refreshData() {
    this.loadData();
  }

  getTimelineHeight(count: number): string {
    const max = this.maxTimelineCount();
    const height = Math.max(8, (count / max) * 48);
    return `${height}px`;
  }

  private loadData(): void {
    this.api.getEvents().subscribe((events) => {
      this.rowData.set(events);
      this.totalCount.set(events.length);
      this.filteredCount.set(events.length);
      this.updatePaginationInfo();
    });
  }

  private updateCounts(): void {
    const api = this.gridApi();
    if (!api) return;
    const displayed = api.getDisplayedRowCount();
    const total = this.rowData().length;
    this.filteredCount.set(displayed);
    this.totalCount.set(total);
    this.updatePaginationInfo();
  }

  isExternalFilterPresent = () => {
    const status = this.statusFilters();
    const methods = this.methodFilters();
    const regions = this.regionFilters();
    const latency = this.latencyRange();
    const statusActive = !status.success || !status.warning || !status.error;
    return (
      statusActive || methods.size > 0 || regions.size > 0 || latency.min > 0 || latency.max < 2000
    );
  };

  doesExternalFilterPass = (node: any) => {
    const data: ObservabilityEvent = node.data;
    if (!data) return true;

    const status = this.statusFilters();
    if (!status[data.level]) return false;

    const methods = this.methodFilters();
    if (methods.size > 0 && !methods.has(data.method)) return false;

    const regions = this.regionFilters();
    if (regions.size > 0 && !regions.has(data.region)) return false;

    const latency = this.latencyRange();
    if (data.latencyMs < latency.min || data.latencyMs > latency.max) return false;

    return true;
  };

  toggleControls() {
    this.controlsHidden.update((v) => !v);
  }

  toggleStatus(level: 'success' | 'warning' | 'error') {
    this.statusFilters.update((curr) => ({ ...curr, [level]: !curr[level] }));
  }

  toggleMethod(method: string) {
    this.methodFilters.update((set) => {
      const next = new Set(set);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  }

  toggleRegion(region: string) {
    this.regionFilters.update((set) => {
      const next = new Set(set);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  }

  updateLatency(field: 'min' | 'max', value: number) {
    const clamped = Math.min(Math.max(value, 0), 5000);
    this.latencyRange.update((curr) => ({
      ...curr,
      [field]: clamped,
    }));
  }

  clearFilters() {
    this.statusFilters.set({ success: true, warning: true, error: true });
    this.methodFilters.set(new Set());
    this.regionFilters.set(new Set());
    this.latencyRange.set({ min: 0, max: 2000 });
  }

  private applyExternalFilter() {
    this.gridApi()?.onFilterChanged();
    this.updateCounts();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.gridApi()?.setGridOption('paginationPageSize', size);
    this.updatePaginationInfo();
  }

  goToPage(direction: 'first' | 'prev' | 'next' | 'last') {
    const api = this.gridApi();
    if (!api) return;
    switch (direction) {
      case 'first':
        api.paginationGoToFirstPage();
        break;
      case 'prev':
        api.paginationGoToPreviousPage();
        break;
      case 'next':
        api.paginationGoToNextPage();
        break;
      case 'last':
        api.paginationGoToLastPage();
        break;
    }
    this.updatePaginationInfo();
  }

  updatePaginationInfo() {
    const api = this.gridApi();
    if (!api) return;
    const currentPage = api.paginationGetCurrentPage();
    const totalPages = api.paginationGetTotalPages();
    const displayed = api.getDisplayedRowCount();
    if (displayed === 0) {
      this.paginationText.set('No rows');
      return;
    }
    const start = api.paginationGetPageSize() * currentPage + 1;
    const end = Math.min(api.paginationGetPageSize() * (currentPage + 1), displayed);
    this.paginationText.set(
      `Rows ${start}-${end} of ${displayed} (Page ${currentPage + 1} of ${totalPages})`
    );
  }

  canGoPrev(): boolean {
    const api = this.gridApi();
    if (!api) return false;
    return api.paginationGetCurrentPage() > 0;
  }

  canGoNext(): boolean {
    const api = this.gridApi();
    if (!api) return false;
    return api.paginationGetCurrentPage() < api.paginationGetTotalPages() - 1;
  }
}
