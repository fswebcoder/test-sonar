import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookiesService } from '../cookies';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const cookiesService: CookiesService = inject(CookiesService);

  const token = `Bearer ${cookiesService.getCookie('token', false)}`;
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: token
    }
  });

  return next(clonedRequest);
};
