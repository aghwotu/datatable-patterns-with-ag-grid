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
  title: 'Column Visibility Toggle',
  description:
    'Toggle which columns to display using a checkbox dropdown menu. Built with Angular CDK Menu for accessibility and smooth UX.',
  tags: ['Column Management', 'Banking', 'CDK Menu'],
  previewGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
  hasCustomRoute: true,
};

const ellipsisActionsDemo: Demo = {
  id: 'ellipsis-actions',
  title: 'Ellipsis Actions Menu',
  description:
    'Row-level contextual actions via a three-dot menu. Actions can be dynamically hidden or disabled based on row data.',
  tags: ['Row Actions', 'Contextual Menu', 'Cell Renderer'],
  previewGradient: 'from-violet-500 via-purple-600 to-fuchsia-700',
  hasCustomRoute: true,
};

const floatingFiltersDemo: Demo = {
  id: 'floating-filters',
  title: 'Floating Filter Dropdowns',
  description:
    'Custom dropdown filters above columns for quick, intuitive filtering. Implements IFloatingFilter with reusable dropdown components.',
  tags: ['Floating Filters', 'Custom Components', 'Client-Side Filtering'],
  previewGradient: 'from-amber-500 via-orange-600 to-red-700',
  hasCustomRoute: true,
};

const serverSideFilteringDemo: Demo = {
  id: 'server-side-filtering',
  title: 'Server-Side Filtering',
  description:
    'Server-side filtering and pagination with mock API. Features loading states, debounced search, and custom pagination controls.',
  tags: ['Server-Side Data', 'API Pagination', 'Loading States'],
  previewGradient: 'from-sky-500 via-blue-600 to-indigo-700',
  hasCustomRoute: true,
};

const customCellRenderersDemo: Demo = {
  id: 'custom-cell-renderers',
  title: 'Custom Cell Renderers',
  description:
    'Rich visual components inside grid cells: avatars, progress bars, badges with icons, trend indicators, and formatted currency.',
  tags: ['ICellRendererAngularComp', 'Visual Cells', 'Rich Data Display'],
  previewGradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
  hasCustomRoute: true,
};

const groupedColumnsDemo: Demo = {
  id: 'grouped-columns',
  title: 'Grouped Column Headers',
  description:
    'Organize related columns under shared headers using ColGroupDef. Toggle entire column groups on/off with the visibility control.',
  tags: ['ColGroupDef', 'Group Visibility', 'Nested Headers'],
  previewGradient: 'from-lime-500 via-green-600 to-emerald-700',
  hasCustomRoute: true,
};

const tradingPlatformDemo: Demo = {
  id: 'trading-platform',
  title: 'Trading Platform',
  description:
    'A comprehensive trading orders grid combining all AG-Grid features: column visibility, ellipsis actions, floating filters, server-side pagination, and custom cell renderers.',
  tags: ['All Features', 'Server-Side', 'Trading Orders'],
  previewGradient: 'from-amber-500 via-orange-600 to-red-700',
  hasCustomRoute: true,
};

const observabilityDemo: Demo = {
  id: 'observability',
  title: 'Observability Table',
  description:
    'Dark-themed operations dashboard with status badges, latency metrics, timing phase bars, and external filter rail built with mango accordions.',
  tags: ['Observability', 'Latency', 'Filters'],
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
