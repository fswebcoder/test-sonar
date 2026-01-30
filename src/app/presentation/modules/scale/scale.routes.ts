import { Routes } from '@angular/router';

export default [
  {
    path: 'dashboard',
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('@scale/modules/dashboard/dashboard-smart/dashboard-smart.component').then(m => m.DashboardSmartComponent)
  },
  {
    path: 'vehiculos',
    data: { breadcrumb: 'Vehículos' },
    loadComponent: () =>
      import('@scale/modules/vehicles/vehicles-smart/vehicles-smart.component').then(m => m.VehiclesSmartComponent)
  },
  {
    path: 'conductores',
    data: { breadcrumb: 'Conductores' },
    loadComponent: () =>
      import('@scale/modules/drivers/drivers-smart/drivers-smart.component').then(m => m.DriversSmartComponent)
  },
  {
    path: 'tipos-de-material',
    data: { breadcrumb: 'Tipos de material' },
    loadComponent: () =>
      import('@scale/modules/material-types/material-types-smart/material-types-smart.component').then(m => m.MaterialTypesSmartComponent)
  },
  {
    path: 'recepcion-de-material',
    data: { breadcrumb: 'Recepciones de material' },
    loadComponent: () =>
      import('@/presentation/modules/scale/modules/weight-register/material-receptions/material-receptions-smart/material-receptions-smart.component').then(m => m.MaterialReceptionsSmartComponent)
  },
{
  path: 'movimiento-de-material',
  data: { breadcrumb: 'Movimiento de material' },
  loadComponent: () =>
    import('@/presentation/modules/scale/modules/weight-register/material-movements/material-movements-smart/material-movements-smart.component').then(m => m.MaterialMovementsSmartComponent)
},
  {
    path: 'ordenes-de-pesaje',
    data: { breadcrumb: 'Órdenes de pesaje' },
    loadComponent: () =>
      import('@scale/modules/orders/orders-smart/orders-smart.component').then(m => m.OrdersSmartComponent)
  }
] as Routes;
