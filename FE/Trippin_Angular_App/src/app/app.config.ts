import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideUserManagement } from '@trippin/user-management';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { provideTrips } from '@trippin/trips';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'authjs.csrf-token'
      }),),
    provideAnimations(),
    provideUserManagement(),
    provideTrips(),
    provideRouter(routes)]
};
