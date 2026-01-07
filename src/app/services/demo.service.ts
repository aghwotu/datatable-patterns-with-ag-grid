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
  rowData: any[];
  columnDefs: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  private demos: Demo[] = [basicGridDemo, employeeDirectoryDemo, analyticsDashboardDemo];

  getDemos(): Demo[] {
    return this.demos;
  }

  getDemoById(id: string): Demo | undefined {
    return this.demos.find((demo) => demo.id === id);
  }
}
