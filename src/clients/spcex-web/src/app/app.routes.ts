import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'launches',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./launches/pages/launches-page/launches-page').then(
        (m) => m.LaunchesPageComponent,
      ),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/pages/register/register').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: 'auth/login' },
];
