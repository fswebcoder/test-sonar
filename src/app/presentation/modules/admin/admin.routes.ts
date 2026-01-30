import { Routes } from "@angular/router";

export default [
    {
        path: 'roles',
        data: { breadcrumb: 'Roles' },
        loadComponent: () => import('@admin/modules/roles/roles-smart/roles-smart.component').then(m => m.RolesSmartComponent)
    },
    {
        path: 'proveedores',
        data: { breadcrumb: 'Proveedores' },

        loadComponent: () => import('@admin/modules/suppliers/suppliers-list-smart/suppliers-list-smart.component').then(m => m.SuppliersListSmartComponent)
    },
    {
        path: 'usuarios',
        data: { breadcrumb: 'Usuarios' },
        loadComponent: () => import('@admin/modules/users/users-smart/users-smart.component').then(m => m.UsersSmartComponent)
    },
] as Routes