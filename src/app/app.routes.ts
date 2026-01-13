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
    path: 'demo/server-side-filtering',
    loadComponent: () =>
      import('./demos/server-side-filtering/server-side-filtering-demo.component').then(
        (m) => m.ServerSideFilteringDemoComponent
      ),
  },
  {
    path: 'demo/custom-cell-renderers',
    loadComponent: () =>
      import('./demos/custom-cell-renderers/custom-cell-renderers-demo.component').then(
        (m) => m.CustomCellRenderersDemoComponent
      ),
  },
  {
    path: 'demo/grouped-columns',
    loadComponent: () =>
      import('./demos/grouped-columns/grouped-columns-demo.component').then(
        (m) => m.GroupedColumnsDemoComponent
      ),
  },
  {
    path: 'demo/trading-platform',
    loadComponent: () =>
      import('./demos/trading-platform/trading-platform-demo.component').then(
        (m) => m.TradingPlatformDemoComponent
      ),
  },
  {
    path: 'demo/observability',
    loadComponent: () =>
      import('./demos/observability/observability-demo.component').then(
        (m) => m.ObservabilityDemoComponent
      ),
  },
  {
    path: 'demo/mobile-responsive',
    loadComponent: () =>
      import('./demos/mobile-responsive/mobile-responsive-demo.component').then(
        (m) => m.MobileResponsiveDemoComponent
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
