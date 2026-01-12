import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { CustomTheme } from './shared/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomTheme ,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
          
        },
      },
    }),
    provideHttpClient(),
    provideMarkdown(),
    provideOAuthClient(), 
    provideHttpClient(withInterceptorsFromDi()),   
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
};
