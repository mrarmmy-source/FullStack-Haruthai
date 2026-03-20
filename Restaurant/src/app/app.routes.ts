import { Routes } from '@angular/router';
import { customerGuard, staffGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), title: 'Ha-ru-thai — เข้าสู่ระบบ' },
  { path: 'register', loadComponent: () => import('./pages/reg/register.component').then(m => m.RegisterComponent), title: 'Ha-ru-thai — สมัครสมาชิก' },

  // Customer (เฉพาะ role = customer)
  { path: 'customer/home', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/homeCustomer/home-c.component').then(m => m.CustomerHomeComponent), title: 'Ha-ru-thai — หน้าหลัก' },
  { path: 'customer/menu', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/menu/menu-customer.component').then(m => m.MenuCustomerComponent), title: 'Ha-ru-thai — เมนูอาหาร' },
  { path: 'customer/reservations', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/booking/booking.component').then(m => m.BookingComponent), title: 'Ha-ru-thai — จองโต๊ะ' },
  { path: 'customer/history', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/booking-history/booking-history.component').then(m => m.BookingHistoryComponent), title: 'Ha-ru-thai — ประวัติการจอง' },
  { path: 'customer/orders', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/order_customer/order-customer.component').then(m => m.OrderCustomerComponent), title: 'Ha-ru-thai — ออเดอร์ของฉัน' },
  { path: 'customer/payments', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/payment_customer/payment-customer.component').then(m => m.PaymentCustomerComponent), title: 'Ha-ru-thai — ประวัติชำระเงิน' },
  { path: 'customer/profile', canActivate: [customerGuard], loadComponent: () => import('./pages/customer/profile/profile.component').then(m => m.ProfileComponent), title: 'Ha-ru-thai — ข้อมูลของฉัน' },

  // Staff (เฉพาะ role = staff)
  { path: 'home', canActivate: [staffGuard], loadComponent: () => import('./pages/staff/homeStaff/home-s.component').then(m => m.HomeComponent), title: 'Ha-ru-thai — Admin' },
  { path: 'staff/menu', canActivate: [staffGuard], loadComponent: () => import('./pages/staff/menu_admin/menu-admin.component').then(m => m.MenuAdminComponent), title: 'Ha-ru-thai — จัดการเมนู' },
  { path: 'staff/bookings', canActivate: [staffGuard], loadComponent: () => import('./pages/staff/booking_admin/booking-admin.component').then(m => m.BookingAdminComponent), title: 'Ha-ru-thai — การจองโต๊ะ' },
  { path: 'staff/orders', canActivate: [staffGuard], loadComponent: () => import('./pages/staff/order_admin/order-admin.component').then(m => m.OrderAdminComponent), title: 'Ha-ru-thai — จัดการออเดอร์' },
  { path: 'staff/payments', canActivate: [staffGuard], loadComponent: () => import('./pages/staff/payment_admin/payment-admin.component').then(m => m.PaymentAdminComponent), title: 'Ha-ru-thai — การชำระเงิน' },
];
