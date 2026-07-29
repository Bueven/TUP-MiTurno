import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = sessionStorage.getItem('session');

  if (session) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
