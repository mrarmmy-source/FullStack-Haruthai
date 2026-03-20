import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Ha-ru-thai — เข้าสู่ระบบ',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/reg/register.component').then(m => m.RegisterComponent),
    title: 'Ha-ru-thai — ลงทะเบียน',
  },
  {
    path: 'customer/home',
    loadComponent: () =>
      import('./pages/customer/homeCustomer/home-c.component').then(m => m.CustomerHomeComponent),
    title: 'Ha-ru-thai — หน้าหลักลูกค้า',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/staff/homeStaff/home-s.component').then(m => m.HomeComponent),
    title: 'Ha-ru-thai — ร้านอาหาร',
  },
];