import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map((user) => {
      if (user) {
        return router.createUrlTree(['/main']);
      } else {
        return true;
      }
    }),
  );
};
