import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/staff/home/home-s.component').then(m => m.HomeComponent),
    title: 'Ha-ru-thai — ร้านอาหาร',
  },
];