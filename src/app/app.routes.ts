import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'demo/feature-explorer',
    loadComponent: () =>
      import('./demos/feature-explorer/feature-explorer-demo.component').then(
        (m) => m.FeatureExplorerDemoComponent
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
