import { Routes } from '@angular/router';

export default [
  {
    path: 'recepcion-muestras',
    data: { breadcrumb: 'Recepcion muestras' },
    loadComponent: () =>
      import('@lims/modules/receptions/samples/reception-sample-smart/reception-sample-smart.component').then(
        c => c.ReceptionSampleSmartComponent
      )
  },
  {
    path: 'cuarteo-analisis',
    data: { breadcrumb: 'Cuarteo de analisis' },
    loadComponent: () =>
      import('@lims/modules/receptions/quartering/quartering-smart/quartering-smart.component').then(
        c => c.QuarteringSmartComponent
      )
  },

  {
    path: 'absorcion-atomica',
    data: { breadcrumb: 'Absorción atómica' },
    loadComponent: () =>
      import('@lims/modules/analysis/atomic-absorption/atomic-absorption-smart/atomic-absorption-smart.component').then(
        c => c.AtomicAbsorptionSmartComponent
      )
  },
  {
    path: 'determinacion-humedad',
    data: { breadcrumb: 'Determinación de humedad' },
    loadComponent: () =>
      import(
        '@lims/modules/analysis/moisture-determination/moisture-determination-smart/moisture-determination-smart.component'
      ).then(c => c.MoistureDeterminationSmartComponent)
  },
  {
    path: 'leachwell',
    data: { breadcrumb: 'Leachwell' },
    loadComponent: () =>
      import('@lims/modules/analysis/leachwell/leachwell-smart/leachwell-smart.component').then(
        c => c.LeachwellSmartComponent
      )
  },
  {
    path: 'xrf',
    data: { breadcrumb: 'XRF' },
    loadComponent: () =>
      import('@lims/modules/analysis/xrf/xrf-smart/xrf-smart.component').then(c => c.XrfSmartComponent)
  },
  {
    path: 'gestion-muestras',
    data: { breadcrumb: 'Gestión de muestras' },
    loadComponent: () =>
      import('@lims/modules/management/samples/samples-smart/samples-smart.component').then(
        c => c.SamplesSmartComponent
      )
  },
  {
    path: 'gestion-muestras/:id',
    data: { breadcrumb: 'Detalle de muestra' },
    loadComponent: () =>
      import('@lims/modules/management/samples-detail/samples-detail-smart/samples-detail-smart.component').then(
        c => c.SamplesDetailSmartComponent
      )
  },
  {
    path:"gestion-dore",
    data: { breadcrumb: 'Gestión de dore' },
    loadComponent: () =>
      import('@lims/modules/management/dore/dore-smart/dore-smart.component').then(
        c => c.DoreSmartComponent
      )
  },
  {
    path: 'recepcion-dore',
    data: { breadcrumb: 'Recepcion dore' },
    loadComponent: () =>
      import('@lims/modules/receptions/dore/dore-smart/dore-smart.component').then(
        c => c.DoreSmartComponent
      )
  },
  {
    path: 'retalla',
    data: { breadcrumb: 'Retalla' },
    loadComponent: () =>
      import('@lims/modules/analysis/retalla/retalla-smart/retalla-smart.component').then(
        c => c.RetallaSmartComponent
      )
  },
  {
    path: 'ensayo-al-fuego',
    data: { breadcrumb: 'Ensayo al fuego' },
    loadComponent: () =>
      import('@lims/modules/analysis/fire-assay/fire-assay-smart/fire-assay-smart.component').then(
        c => c.FireAssaySmartComponent
      )
  },
  {
    path: "recepcion-laboratorio",
    data: { breadcrumb: 'Recepcion laboratorio' },
    loadComponent: () =>
      import('@lims/modules/receptions/laboratory/laboratory-smart/laboratory-smart.component').then(
        c => c.LaboratorySmartComponent
      )
  },
  {
    path: 'tipos-de-muestra',
    data: { breadcrumb: 'Tipos de muestra' },
    loadComponent: () =>
      import('@lims/modules/sample-types/sample-types-smart/sample-types-smart.component').then(
        c => c.SampleTypesSmartComponent
      )
  },
  {
    path: 'envio-de-muestras',
    data: { breadcrumb: 'Envío de muestras' },
    loadComponent: () =>
      import('@lims/modules/receptions/sample-sending/sample-sending-smart/sample-sending-smart.component').then(
        c => c.SampleSendingSmartComponent
      )
  },
  {
    path: 'recepciones-pendientes',
    data: { breadcrumb: 'Recepciones pendientes' },
    loadComponent: () =>
      import('@lims/modules/receptions/pending-receptions/pending-receptions-smart/pending-receptions-smart.component').then(
        c => c.PendingReceptionsSmartComponent
      )
  }
] as Routes;
