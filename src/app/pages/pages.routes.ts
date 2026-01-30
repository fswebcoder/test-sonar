import { Routes } from '@angular/router';
import { PublicGuard } from '@/core/guards/public.guard';

export default [
    {
        path: '',
        canActivate: [PublicGuard],
        children: [
            {
                path: 'login',
                loadComponent: () => import('@pages/auth/home-login/home-login.component').then(m => m.HomeLoginComponent)
            }
        ]
    }

] as Routes;
