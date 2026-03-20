import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const customerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('haruthai_role');
  if (!role) { router.navigate(['/login']); return false; }
  if (role !== 'customer') { router.navigate(['/home']); return false; }
  return true;
};

export const staffGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('haruthai_role');
  if (!role) { router.navigate(['/login']); return false; }
  if (role !== 'staff') { router.navigate(['/customer/home']); return false; }
  return true;
};
