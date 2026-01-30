import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookiesService } from '../cookies';

export const authGuard: CanActivateFn = (route, state) => {
    const cookieService: CookiesService = inject(CookiesService);
    const router: Router = inject(Router);
    const token = cookieService?.getCookie('token');
    const isAuthenticated = !!token;
    return isAuthenticated ? true : router.createUrlTree(['/login']);
};
