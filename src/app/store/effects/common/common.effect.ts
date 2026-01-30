import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  citiesListFailureAction,
  citiesListSuccessAction,
  departmentsListFailureAction,
  departmentsListSuccessAction,
  documentTypesListFailureAction,
  documentTypesListSuccessAction,
  doreReceptionOriginsListFailureAction,
  doreReceptionOriginsListSuccessAction,
  getCitiesAction,
  getDepartmentsAction,
  getDocumentTypesAction,
  getDoreReceptionOriginsAction,
  getRolesInternalAction,
  printersListSuccessAction,
  printersListFailureAction,
  rolesInternalListFailureAction,
  rolesInternalListSuccessAction,
  getPrintersAction,
  getPersonnelAction,
  personnelListFailureAction,
  personnelListSuccessAction,
  getPersonnelPositionAction,
  personnelPositionSuccessAction,
  personnelPositionFailureAction,
  pumpsListSuccessAction,
  getPumpsAction,
  pumpsListFailureAction,
  getShiftsConfigAction,
  shiftsConfigListSuccessAction,
  shiftsConfigListFailureAction,
  getAnalysisTypesAction,
  analysisTypesListSuccessAction,
  analysisTypesListFailureAction,
  getSampleTypesAction,
  sampleTypesListSuccessAction,
  sampleTypesListFailureAction,
  getSuppliersAction,
  suppliersListSuccessAction,
  suppliersListFailureAction,
  getVehicleTypesAction,
  vehicleTypesListSuccessAction,
  vehicleTypesListFailureAction,
  getMaterialTypesAction,
  materialTypesSuccessAction,
  materialTypesFailureAction,
  storageZonesSuccessAction,
  storageZonesFailureAction,
  getStorageZonesAction,
  getDriversAction,
  driversSuccessAction,
  driversFailureAction,
  getVehiclesAction,
  vehiclesSuccessAction,
  vehiclesFailureAction,
  getMillsAction,
  millsSuccessAction,
  millsFailureAction,
  getBigBagTypesAction,
  bigBagTypesSuccessAction,
  bigBagTypesFailureAction,
} from '@/store/actions/common/common.action';
import { DepartmentsUseCase } from '@/domain/use-cases/common/departments.usecases';
import { CitiesUseCase } from '@/domain/use-cases/common/cities.usecases';
import { CatalogsUseCases } from '@/domain/use-cases/common/catalogs.usecases';
import { PrintersUseCase } from '@/domain/use-cases/common/printers.usecase';

@Injectable()
export class CommonEffect {
  private readonly actions$ = inject(Actions);
  private readonly departmentsUseCase = inject(DepartmentsUseCase);
  private readonly citiesUseCase = inject(CitiesUseCase);
  private readonly catalogsUseCases = inject(CatalogsUseCases);
  private readonly printersUseCase = inject(PrintersUseCase);
  getDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDepartmentsAction),
      switchMap(() => this.departmentsUseCase.getAll()),
      map(response => departmentsListSuccessAction({ departments: response.data })),
      catchError(error => of(departmentsListFailureAction({ error: error.message })))
    )
  );

  getCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCitiesAction),
      switchMap(() => this.citiesUseCase.getAll()),
      map(response => citiesListSuccessAction({ cities: response.data })),
      catchError(error => of(citiesListFailureAction({ error: error.message })))
    )
  );

  getDoreReceptionOrigins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDoreReceptionOriginsAction),
      switchMap(() => this.catalogsUseCases.execute('DORE_RECEPTION_ORIGINS')),
      map(response => doreReceptionOriginsListSuccessAction({ doreReceptionOrigins: response.data })),
      catchError(error => of(doreReceptionOriginsListFailureAction({ error: error.message })))
    )
  );

  getPrinters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPrintersAction),
      switchMap(() => this.printersUseCase.getAll()),
      map(response => printersListSuccessAction({ printers: response.data })),
      catchError(error => of(printersListFailureAction({ error: error.message })))
    )
  );

  getDocumentTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDocumentTypesAction),
      switchMap(() => this.catalogsUseCases.execute('DOCUMENT_TYPES')),
      map(response => documentTypesListSuccessAction({ documentTypes: response.data })),
      catchError(error => of(documentTypesListFailureAction({ error: error.message })))
    )
  );

  getRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRolesInternalAction),
      switchMap(() => this.catalogsUseCases.execute('ROLES_INTERNAL')),
      map(response => rolesInternalListSuccessAction({ roles: response.data })),
      catchError(error => of(rolesInternalListFailureAction({ error: error.message })))
    )
  );

  getPersonnel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPersonnelAction),
      switchMap(() => this.catalogsUseCases.execute('PERSONNEL')),
      map(response => personnelListSuccessAction({ personnel: response.data })),
      catchError(error => of(personnelListFailureAction({ error: error.message })))
    )
  );

  getPersonnelPositions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPersonnelPositionAction),
      switchMap(() => this.catalogsUseCases.execute('PERSONNEL_POSITIONS')),
      map(response => personnelPositionSuccessAction({ personnelPositions: response.data })),
      catchError(error => of(personnelPositionFailureAction({ error: error.message })))
    )
  );

  getShiftsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getShiftsConfigAction),
      switchMap(() => this.catalogsUseCases.execute('SHIFTS_CONFIG')),
      map(response => shiftsConfigListSuccessAction({ shiftsConfig: response.data })),
      catchError(error => of(shiftsConfigListFailureAction({ error: error.message })))
    )
  );

  getPumps$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPumpsAction),
      switchMap(() => this.catalogsUseCases.execute('PUMPS')),
      map(response => pumpsListSuccessAction({ pumps: response.data })),
      catchError(error => of(pumpsListFailureAction({ error: error.message })))
    )
  );

  getAnalysisTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAnalysisTypesAction),
      switchMap(() => this.catalogsUseCases.execute('ANALYSIS_TYPES')),
      map(response => analysisTypesListSuccessAction({ analysisTypes: response.data })),
      catchError(error => of(analysisTypesListFailureAction({ error: error.message })))
    )
  );

  getSampleTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSampleTypesAction),
      switchMap(() => this.catalogsUseCases.execute('SAMPLE_TYPES')),
      map(response => sampleTypesListSuccessAction({ sampleTypes: response.data })),
      catchError(error => of(sampleTypesListFailureAction({ error: error.message })))
    )
  );

  getSuppliers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSuppliersAction),
      switchMap(() => this.catalogsUseCases.execute('SUPPLIERS')),
      map(response => suppliersListSuccessAction({ suppliers: response.data })),
      catchError(error => of(suppliersListFailureAction({ error: error.message })))
    )
  );

  getVehicleTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getVehicleTypesAction),
      switchMap(() => this.catalogsUseCases.execute('VEHICLE_TYPES')),
      map(response => vehicleTypesListSuccessAction({ vehicleTypes: response.data })),
      catchError(error => of(vehicleTypesListFailureAction({ error: error.message })))
    )
  );

  getMaterialTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMaterialTypesAction),
      switchMap(() => this.catalogsUseCases.execute('MATERIAL_TYPES')),
      map(response => materialTypesSuccessAction({ materialTypes: response.data })),
      catchError(error => of(materialTypesFailureAction({ error: error.message })))
    )
  );

  getStorageZones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getStorageZonesAction),
      switchMap(() => this.catalogsUseCases.execute('STORAGE_ZONES')),
      map(response => storageZonesSuccessAction({ storageZones: response.data })),
      catchError(error => of(storageZonesFailureAction({ error: error.message })))
    )
  );

  getDrivers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDriversAction),
      switchMap(() => this.catalogsUseCases.execute('DRIVERS')),
      map(response => driversSuccessAction({ drivers: response.data })),
      catchError(error => of(driversFailureAction({ error: error.message })))
    )
  );

  getVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getVehiclesAction),
      switchMap(() => this.catalogsUseCases.execute('VEHICLES')),
      map(response => vehiclesSuccessAction({ vehicles: response.data })),
      catchError(error => of(vehiclesFailureAction({ error: error.message })))
    )
  );

  getMills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMillsAction),
      switchMap(() => this.catalogsUseCases.execute('MILLS')),
      map(response => millsSuccessAction({ mills: response.data })),
      catchError(error => of(millsFailureAction({ error: error.message })))
    )
  );

  getBigBagTypes$ = createEffect(() => 
    this.actions$.pipe(
      ofType(getBigBagTypesAction),
      switchMap(() => this.catalogsUseCases.execute('BIG_BAG_TYPES')),
      map(response => bigBagTypesSuccessAction({ bigBagTypes: response.data })),
      catchError(error => of(bigBagTypesFailureAction({ error: error.message })))
    )
  );

}
