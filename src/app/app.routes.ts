import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'demo/column-visibility',
    loadComponent: () =>
      import('./demos/column-visibility/column-visibility-demo.component').then(
        (m) => m.ColumnVisibilityDemoComponent
      ),
  },
  {
    path: 'demo/ellipsis-actions',
    loadComponent: () =>
      import('./demos/ellipsis-actions/ellipsis-actions-demo.component').then(
        (m) => m.EllipsisActionsDemoComponent
      ),
  },
  {
    path: 'demo/floating-filters',
    loadComponent: () =>
      import('./demos/floating-filters/floating-filters-demo.component').then(
        (m) => m.FloatingFiltersDemoComponent
      ),
  },
  {
    path: 'demo/:id',
    loadComponent: () =>
      import('./pages/demo-detail/demo-detail.component').then((m) => m.DemoDetailComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
