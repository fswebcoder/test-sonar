import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { IGeneralResponse } from '../../public-api';
import { CookiesService } from '../cookies';

export interface EnvConfig {
  redirectLogin: string;
  appDominioCookies: string;
}

export const ENV = new InjectionToken<EnvConfig>('env');

export const httpErrorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cookiesService = inject(CookiesService);
  const router = inject(Router);

  const validarRespuestaPoseeError = (evento: HttpResponse<IGeneralResponse<unknown>>): boolean => {
    return (
      evento &&
      Object.prototype.hasOwnProperty.call(evento, 'body') &&
      (!evento.body || (evento.body.data === null && evento.body.message !== ''))
    );
  };

  const validarRespuesta = (evento: HttpResponse<IGeneralResponse<unknown>>): HttpEvent<unknown> => {
    if (evento instanceof HttpResponse && validarRespuestaPoseeError(evento)) {
      const errorResponse: IGeneralResponse<unknown> = {
        message: evento.body?.message || 'Error desconocido',
        data: null,
        path: evento.url || '',
        timestamp: new Date(),
        statusCode: evento.status
      };

      return new HttpResponse({
        body: errorResponse,
        headers: evento.headers,
        status: evento.status,
        statusText: evento.statusText,
        url: evento.url || undefined
      });
    }
    return evento;
  };

  return next(req).pipe(
    map(respuesta => validarRespuesta(respuesta as HttpResponse<IGeneralResponse<unknown>>)),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        cookiesService.deleteAllCookies();
        router.navigate(['/']);
      }

      return of(
        new HttpResponse({
          body: {
            message: error.message || 'Error en la petición',
            data: null,
            path: error.url || '',
            timestamp: new Date(),
            status: error.status.toString(),
            error: true
          },
          status: error.status,
          statusText: error.statusText,
          url: error.url || undefined
        })
      );
    })
  );
};
