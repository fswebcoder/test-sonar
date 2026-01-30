import { Routes } from '@angular/router';

export default [
  {
    data: { breadcrumb: 'Turno actual' },
    path: 'turno-actual',
    loadComponent: () =>
      import('@plant/modules/shift/current-shift/current-shift-smart/current-shift-smart.component').then(
        m => m.CurrentShiftSmartComponent
      )
  },
  {
    path: 'configuracion-turno',
    data: { breadcrumb: 'Configuración de turno' },
    loadComponent: () =>
      import('@plant/modules/shift/shift-config/shift-config-smart/shift-config-smart.component').then(
        m => m.ShiftConfigSmartComponent
      )
  },
  {
    path: 'gestion-molienda',
    data: { breadcrumb: 'Gestión de molienda' },
    loadComponent: () =>
      import('@plant/modules/milling/milling-management/milling-management-smart/milling-management-smart.component').then(
        m => m.MillingManagementSmartComponent
      )
  },
  {
    path: 'detalle-molienda',
    data: { breadcrumb: 'Detalle de molienda' },
    loadComponent: () =>
      import('@plant/modules/milling/milling-detail/milling-detail-smart/milling-detail-smart.component').then(
        m => m.MillingDetailSmartComponent
      )
  },
  {
    path: 'llenado-big-bags',
    data: { breadcrumb: 'Llenado de Big Bags' },
    loadComponent: () =>
      import('@plant/modules/drying/big-bags-filling/big-bags-filling-smart/big-bags-filling-smart.component').then(
        m => m.BigBagsFillingSmartComponent
      )
  },
  {
    path: 'gestion-ordenes',
    data: { breadcrumb: 'Gestión de órdenes' },
    loadComponent: () =>
      import('@plant/modules/drying/order-management/order-management-smart/order-management-smart.component').then(
        m => m.OrderManagementSmartComponent
      )
  }
] as Routes;
