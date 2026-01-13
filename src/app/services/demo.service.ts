import { Injectable } from '@angular/core';

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

// Real-world showcase: Observability table inspired by OpenStatus
const observabilityDemo: Demo = {
  id: 'observability',
  title: 'Observability Table',
  description:
    'An ops dashboard inspired by data-table.openstatus.dev — status & latency highlighting, side filters, and a drill‑down panel for details.',
  tags: ['Ops Dashboard', 'OpenStatus', 'Details Panel'],
  previewGradient: 'from-cyan-500 via-sky-600 to-indigo-700',
  hasCustomRoute: true,
};

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [
    featureExplorerDemo,
    observabilityDemo,
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
