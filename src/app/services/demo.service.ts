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

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [
    columnVisibilityDemo,
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
