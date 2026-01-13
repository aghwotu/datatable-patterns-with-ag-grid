import { Injectable } from '@angular/core';
import { basicGridDemo } from './data/basic-grid.data';
import { employeeDirectoryDemo } from './data/employee-directory.data';
import { analyticsDashboardDemo } from './data/analytics-dashboard.data';

export interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  previewGradient: string;
  /** If true, this demo has a dedicated route at /demo/{id} */
  hasCustomRoute?: boolean;
  rowData?: any[];
  columnDefs?: any[];
}

// Feature demos with custom routes (showcasing specific AG-Grid features)
const columnVisibilityDemo: Demo = {
  id: 'column-visibility',
  title: 'Column Management',
  description:
    'Let users show/hide columns so wide tables stay readable by default, without losing access to the full dataset.',
  tags: ['Show/Hide Columns', 'Wide Tables', 'User Control'],
  previewGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
  hasCustomRoute: true,
};

const ellipsisActionsDemo: Demo = {
  id: 'ellipsis-actions',
  title: 'Row Actions & Context Menus',
  description:
    'A “three‑dot” row menu where actions change based on the row state (and can be hidden/disabled like a real product).',
  tags: ['Row Menu', 'Conditional Actions', 'Permissions'],
  previewGradient: 'from-violet-500 via-purple-600 to-fuchsia-700',
  hasCustomRoute: true,
};

const floatingFiltersDemo: Demo = {
  id: 'floating-filters',
  title: 'Floating Filter Dropdowns',
  description:
    'Quick filter dropdowns directly in the header row, so users can narrow results without opening extra panels.',
  tags: ['Quick Filters', 'Header Dropdowns', 'Client-Side'],
  previewGradient: 'from-amber-500 via-orange-600 to-red-700',
  hasCustomRoute: true,
};

const serverSideFilteringDemo: Demo = {
  id: 'server-side-filtering',
  title: 'Server-Driven Data & Filtering',
  description:
    'Pagination + filtering with a mock API to mimic “large dataset” behavior: loading states, debounce, and latency-friendly UX.',
  tags: ['Large Datasets', 'Loading UX', 'Server Data'],
  previewGradient: 'from-sky-500 via-blue-600 to-indigo-700',
  hasCustomRoute: true,
};

const customCellRenderersDemo: Demo = {
  id: 'custom-cell-renderers',
  title: 'Custom Cell Renderers',
  description:
    'Readable “rich cells” (avatars, badges, progress, trends, currency) to make dense tables faster to scan.',
  tags: ['Rich Cells', 'Fast Scanning', 'Formatting'],
  previewGradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
  hasCustomRoute: true,
};

const groupedColumnsDemo: Demo = {
  id: 'grouped-columns',
  title: 'Grouped Column Headers',
  description:
    'Group related columns under shared headers so wide tables feel organized, and toggle whole groups on/off.',
  tags: ['Column Groups', 'Wide Tables', 'Show/Hide Groups'],
  previewGradient: 'from-lime-500 via-green-600 to-emerald-700',
  hasCustomRoute: true,
};

const tradingPlatformDemo: Demo = {
  id: 'trading-platform',
  title: 'Trading Platform',
  description:
    'A high‑density trading orders table designed for fast scanning, quick filtering, and actions that depend on order state.',
  tags: ['High Density', 'Fast Scanning', 'Row Actions'],
  previewGradient: 'from-amber-500 via-orange-600 to-red-700',
  hasCustomRoute: true,
};

const observabilityDemo: Demo = {
  id: 'observability',
  title: 'Observability Table',
  description:
    'An ops dashboard table that highlights status and latency, with side filters and a drill‑down panel for details.',
  tags: ['Ops Dashboard', 'Filters', 'Details Panel'],
  previewGradient: 'from-cyan-500 via-sky-600 to-indigo-700',
  hasCustomRoute: true,
};

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [
    tradingPlatformDemo,
    observabilityDemo,
    columnVisibilityDemo,
    ellipsisActionsDemo,
    floatingFiltersDemo,
    serverSideFilteringDemo,
    customCellRenderersDemo,
    groupedColumnsDemo,
    basicGridDemo,
    employeeDirectoryDemo,
    analyticsDashboardDemo,
  ];

  getDemos(): Demo[] {
    return this.demos;
  }

  getDemoById(id: string): Demo | undefined {
    return this.demos.find((demo) => demo.id === id);
  }
}
