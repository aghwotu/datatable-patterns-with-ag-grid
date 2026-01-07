import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
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
