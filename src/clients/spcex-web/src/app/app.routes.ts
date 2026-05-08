import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'missions',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./missions/pages/missions-home/missions-home').then(
        (m) => m.MissionsHome,
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
