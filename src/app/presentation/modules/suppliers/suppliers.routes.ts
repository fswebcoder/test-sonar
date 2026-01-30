import { Routes } from "@angular/router";

export default [
    {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
            import('@/presentation/modules/suppliers/modules/dashboard/supplier-dashboard-smart/supplier-dashboard-smart.component').then(
                m => m.SupplierDashboardSmartComponent
            )
    },
    {
        path: 'envio-de-mineral-cnc',
        data: { breadcrumb: 'Envío de mineral CNC' },
        loadComponent: () =>
            import('@/presentation/modules/suppliers/modules/minerals-send/mineral-send-smart/mineral-send-smart.component').then(
                m => m.MineralSendSmartComponent
            )
    },
    {
        path: 'minas',
        data: { breadcrumb: 'Minas' },
        loadComponent: () =>
            import('@/presentation/modules/suppliers/modules/admin/mines/mines-smart/mines-smart.component').then(
                m => m.MinesSmartComponent
            )
    },
    {
        path: 'contactos',
        data: { breadcrumb: 'Contactos' },
        loadComponent: () =>
            import('@/presentation/modules/suppliers/modules/notifications/contacts/supplier-contacts-smart/supplier-contacts-smart.component').then(
                m => m.SupplierContactsSmartComponent
            )
    },
    {
        path: 'configuracion-notificaciones',
        data: { breadcrumb: 'Configuración de Notificaciones' },
        loadComponent: () =>
            import('@/presentation/modules/suppliers/modules/notifications/configs/notification-configs-smart/notification-configs-smart.component').then(
                m => m.NotificationConfigsSmartComponent
            )
    }
] as Routes;