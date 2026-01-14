import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { CustomTheme } from './shared/theme';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    DialogService,
    MessageService,
    ConfirmationService,
  ],
};
