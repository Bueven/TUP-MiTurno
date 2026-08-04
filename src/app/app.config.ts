import { ApplicationConfig, ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Sentry from '@sentry/angular';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

const firebaseConfig = {
  apiKey: 'AIzaSyA4GibQm3T0PcQmqh_Ct3Vg0rkrpV2ebaU',
  authDomain: 'mi-turno-8384a.firebaseapp.com',
  projectId: 'mi-turno-8384a',
  storageBucket: 'mi-turno-8384a.firebasestorage.app',
  messagingSenderId: '930845020117',
  appId: '1:930845020117:web:bf5e94bafa70539cce375c',
  measurementId: 'G-XK50Q9JJJ4',
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler() },
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      lang: 'es',
      fallbackLang: 'es',
    }),
  ],
};
