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
    path: 'demo/observability',
    loadComponent: () =>
      import('./demos/observability/observability-demo.component').then(
        (m) => m.ObservabilityDemoComponent
      ),
  },
  {
    path: 'design-notes',
    loadComponent: () =>
      import('./pages/design-notes/design-notes.component').then(
        (m) => m.DesignNotesComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
