import { Injectable } from '@angular/core';

export interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  previewGradient: string;
  /** Optional image path (under public/) for the card preview. */
  previewImage?: string;
  /** Marks a demo as work-in-progress so the UI can show a "WIP" label. */
  isWip?: boolean;
  /** If true, this demo has a dedicated route at /demo/{id} */
  hasCustomRoute?: boolean;
  rowData?: any[];
  columnDefs?: any[];
}

// Feature Explorer - controlled environment for isolating AG-Grid behaviors
const featureExplorerDemo: Demo = {
  id: 'feature-explorer',
  title: 'Feature Explorer',
  description:
    'A controlled environment for isolating AG-Grid behaviors—column visibility, row actions, filters, renderers, and grouping—to understand how individual features affect table density, usability, and complexity.',
  tags: ['Feature Isolation', 'Table Density', 'UX Trade-offs'],
  previewGradient: 'from-cyan-500 via-blue-600 to-violet-700',
  previewImage: '/feature-explorer.png',
  hasCustomRoute: true,
  isWip: true,
};

// Production-style observability table inspired by OpenStatus
const observabilityDemo: Demo = {
  id: 'observability',
  title: 'Observability Table',
  description:
    'A production-style observability table inspired by OpenStatus, designed to surface status, latency, and trends without overwhelming operators. Focuses on dense data scanning, conditional highlighting, and drill-down workflows.',
  tags: ['Operational Monitoring', 'High-Signal UI', 'Dense Data'],
  previewGradient: 'from-cyan-500 via-sky-600 to-indigo-700',
  previewImage: '/open-status.png',
  hasCustomRoute: true,
  isWip: true,
};

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [featureExplorerDemo, observabilityDemo];

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
