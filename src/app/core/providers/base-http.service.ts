import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface IHttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpService<T> {
  protected abstract baseUrl: string;
  protected readonly http = inject(HttpClient);

  protected get<R>(path: string = '', options?: IHttpOptions): Observable<R> {
    return this.http.get<R>(`${this.baseUrl}${path}`, options).pipe(catchError(this.handleError));
  }

  protected post<R>(body: any, path: string = '', options?: IHttpOptions): Observable<R> {
    return this.http.post<R>(`${this.baseUrl}${path}`, body, options).pipe(catchError(this.handleError));
  }

  protected put<R>(body: any, path: string = '', options?: IHttpOptions): Observable<R> {
    return this.http.put<R>(`${this.baseUrl}${path}`, body, options).pipe(catchError(this.handleError));
  }

  protected delete<R>(path: string = '', options?: IHttpOptions): Observable<R> {
    return this.http.delete<R>(`${this.baseUrl}${path}`, options).pipe(catchError(this.handleError));
  }

  protected patch<R>(body: any, path: string = '', options?: IHttpOptions): Observable<R> {
    return this.http.patch<R>(`${this.baseUrl}${path}`, body, options).pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
