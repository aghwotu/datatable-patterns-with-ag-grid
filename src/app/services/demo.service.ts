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

// Feature Explorer - interactive feature toggles
const featureExplorerDemo: Demo = {
  id: 'feature-explorer',
  title: 'Feature Explorer',
  description:
    'Toggle AG-Grid features on and off to see exactly what each one does. Column visibility, row actions, filters, cell renderers, and grouped columns — all in one place.',
  tags: ['Interactive', 'Learn Features', 'Toggles'],
  previewGradient: 'from-cyan-500 via-blue-600 to-violet-700',
  hasCustomRoute: true,
};

// Real-world showcase demos (each with a unique UX pattern)
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

const mobileResponsiveDemo: Demo = {
  id: 'mobile-responsive',
  title: 'Mobile Responsive Table',
  description:
    'Adaptive column layouts that respond to screen size. Columns collapse to essentials on mobile with a "View Details" action.',
  tags: ['Responsive', 'Mobile-First', 'Bottom Sheet'],
  previewGradient: 'from-indigo-500 via-purple-600 to-pink-600',
  hasCustomRoute: true,
};

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [
    // Feature learning
    featureExplorerDemo,
    // Real-world showcases
    tradingPlatformDemo,
    observabilityDemo,
    mobileResponsiveDemo,
    // Simple starters
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

  getDemoIndexById(id: string): number {
    return this.demos.findIndex((demo) => demo.id === id);
  }

  getPrevDemo(id: string): Demo | undefined {
    const idx = this.getDemoIndexById(id);
    if (idx <= 0) return undefined;
    return this.demos[idx - 1];
  }

  getNextDemo(id: string): Demo | undefined {
    const idx = this.getDemoIndexById(id);
    if (idx < 0 || idx >= this.demos.length - 1) return undefined;
    return this.demos[idx + 1];
  }
}
