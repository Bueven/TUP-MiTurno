import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Sentry.init({
  dsn: 'https://c2528e1cc92eb418a3fdea16065b2c4b@o4511724564774912.ingest.us.sentry.io/4511724572508160',
  sendDefaultPii: true,
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
