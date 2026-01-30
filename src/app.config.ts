import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, InjectionToken, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import Material from '@primeng/themes/material';
import { definePreset } from '@primeng/themes';
import { provideNgxMask } from 'ngx-mask';
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { Environment } from '@/shared/types/environment';
import { provideCore } from '@/core/providers/store/provide.core';
import { authProvider } from '@/core/providers/auth/auth.provider';
import { ALL_REPOSITORIES } from '@/core/providers/repositories.provide';
import { environment } from './enviromments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from '@/core/interceptors/auth.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PermissionDirective } from '@/core/directives';

export const ENVIRONMENT = new InjectionToken<Environment>('environment');

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    MessageService,
    ConfirmationService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    provideCore(),
 
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withRouterConfig({
        // Configuración para evitar recargas de página
        onSameUrlNavigation: 'ignore',
        urlUpdateStrategy: 'eager',
        canceledNavigationResolution: 'replace'
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    ...ALL_REPOSITORIES,
    providePrimeNG({
      ripple: true,
      inputStyle: 'filled',
      theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
      translation: {
        accept: 'aceptar',
        reject: 'rechazar',
        cancel: 'cancelar',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Semana',
      }
    }),
    provideNgxMask(),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 5 * 60 * 1000, 
            retry: 0,
            refetchOnWindowFocus: false,
            enabled: false
          },
        }
      })
    ),
    importProvidersFrom([
      PermissionDirective

    ]),
  ]
};
