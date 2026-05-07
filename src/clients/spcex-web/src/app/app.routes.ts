import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./auth/pages/register/register').then((m) => m.Register),
  },
  { path: '**', redirectTo: 'auth/login' },
];
