import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const auth = inject(Auth);
  const currentUser = auth.currentUser;

  if (!currentUser || !req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  return from(currentUser.getIdToken()).pipe(
    switchMap((token) => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }),
    catchError((error) => {
      console.error('authInterceptor: no se pudo obtener el token', error);
      return next(req);
    }),
  );
};
