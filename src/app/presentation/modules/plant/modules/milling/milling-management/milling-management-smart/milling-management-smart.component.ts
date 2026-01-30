import { Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { MillingManagementDumpComponent } from '../milling-management-dump/milling-management-dump.component';
import MillingManagementUseCase from '@/domain/use-cases/plant/milling/milling-management.usecase';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import IGetMillsResponseEntity from '@/domain/entities/plant/milling/get-mills-response.entity';
import { lastValueFrom, of } from 'rxjs';
import IPumpEntity from '@/domain/entities/common/pump.entity';
import { Store } from '@ngrx/store';
import { getPumps } from '@/store/selectors/common/common.selectors';
import { CatalogsUseCases } from '@/domain/use-cases/common/catalogs.usecases';
import { IsupplierListResponseEntity } from '@/domain/entities/common/suppliers-list-response.entity';
import { SuppliersUseCase } from '@/domain/use-cases/admin/suppliers/suppliers.usecase';
import { MinesAdminUseCase } from '@/domain/use-cases/suppliers/admin/mines/mines-admin.usecase';
import IAddBatchParamsEntity from '@/domain/entities/plant/milling/add-batch-params.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import IEditVariableParamsEntity from '@/domain/entities/plant/milling/edit-variable-params.entity';
import { HttpErrorResponse } from '@angular/common/http';
import IStopMillingParamsEntity from '@/domain/entities/plant/milling/stop-milling-params.entity';
import { IStartMillingParamsEntity } from '@/domain/entities/plant/milling/start-milling-params.entity';
import IMill from '@/domain/entities/plant/milling/mill.entity';
import { formatDate } from '@/core/utils/format-date';
import IBatchEntity from '@/domain/entities/admin/suppliers/batches/batch.entity';
import { IListBatchesParamsEntity } from '@/domain/entities/admin/suppliers/batches/list-batches-params.entity';
import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { EPlantProcess } from '@/shared/enums/plant-process.enum';
@Component({
  selector: 'svi-milling-management-smart',
  imports: [MillingManagementDumpComponent],
  templateUrl: './milling-management-smart.component.html',
  styleUrl: './milling-management-smart.component.scss'
})
export class MillingManagementSmartComponent {
  millingManagementUsecase: MillingManagementUseCase = inject(MillingManagementUseCase);
  catalogsUseCase: CatalogsUseCases = inject(CatalogsUseCases);
  suppliersUseCase: SuppliersUseCase = inject(SuppliersUseCase);
  minesUsecase: MinesAdminUseCase = inject(MinesAdminUseCase);
  toastService = inject(ToastCustomService);
  destroyRef = inject(DestroyRef);
  store = inject(Store);
  loadingService = inject(LoadingService);

  pumps = signal<IPumpEntity[]>([]);
  suppliers = signal<IsupplierListResponseEntity[]>([]);
  batches = signal<IBatchEntity[]>([]);
  mines = signal<IMineEntity[]>([]);

  @ViewChild(MillingManagementDumpComponent) millingManagementDump!: MillingManagementDumpComponent;

  ngOnInit(): void {
    this.loadInitialData();
  }

  millingsQueryData = computed(() => {
    return this.millingsQuery.data() ?? [];
  });

  loadInitialData() {
    this.store
      .select(getPumps)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pumpsResponse => {
        this.pumps.set(pumpsResponse);
      });

    this.fetchSuppliers();
  }

  saveBatch(event: IAddBatchParamsEntity) {
    this.loadingService.startLoading('general');
    this.millingManagementUsecase
      .addBatch(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.processResponse(res);
          this.millingManagementDump.cancelAddBatch();
        }),
        finalize(() => this.loadingService.stopLoading('general')),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
          return of(null);
        })
      )
      .subscribe();
  }

  saveEditVariable(event: IEditVariableParamsEntity) {
    this.loadingService.startLoading('general');
    this.millingManagementUsecase
      .editVariable(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.processResponse(res);
          this.millingManagementDump.cancelEditVariable();
        }),
        finalize(() => this.loadingService.stopLoading('general')),
        catchError((error:HttpErrorResponse) => {
          this.toastService.error(error.error.message);
          return of(null);
        })
      )
      .subscribe();
  }

  stopMilling(event:IStopMillingParamsEntity) {
    this.loadingService.startLoading('general');
    this.millingManagementUsecase
      .stopMill(event)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.processResponse(res);
        }),
        finalize(() => this.loadingService.stopLoading('general')),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
          return of(null);
        })
      )
      .subscribe();
  }

  startMilling(params: IStartMillingParamsEntity) {
    this.processStartMilling(params);
  }

  finishMilling(mill: IMill) {
    this.finishMill(mill);
  }

  private processStartMilling(params: IStartMillingParamsEntity) {
    this.loadingService.startLoading('general');
    const formattedParams: IStartMillingParamsEntity = {
      ...params,
      restartDate: params.restartDate || formatDate(new Date())
    };

    this.millingManagementUsecase
      .startMill(formattedParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.processResponse(res);
        }),
        finalize(() => this.loadingService.stopLoading('general')),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
          return of(null);
        })
      )
      .subscribe();
  }



  private finishMill(mill: IMill) {
    this.loadingService.startLoading('general');
    this.millingManagementUsecase
      .finishMill(mill.infoShiftId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.processResponse(res);
        }),
        finalize(() => this.loadingService.stopLoading('general')),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(error.error.message);
          return of(null);
        })
      )
      .subscribe();
  }

  private processResponse(res: IGeneralResponse<unknown>) {
    this.millingsQuery.refetch();
    this.batches.set([]);
    this.toastService.success(res.message);
    this.clearForms();
  }

  private clearForms() {
    this.millingManagementDump.cancelAddBatch();
    this.millingManagementDump.cancelEditVariable();
    this.millingManagementDump.cancelStopMilling();
    this.millingManagementDump.cancelStartMilling();
  }

  async changeSupplierId(event: string) {
    this.mines.set([]);
    this.batches.set([]);
    if (!event) {
      return;
    }
    const mines = await this.fetchMines(event);
    this.mines.set(mines);
  }

  async changeMineId(mineId: string) {
    this.batches.set([]);
    if (!mineId) {
      return;
    }

    const batches = await this.fetchBatches({
      mineId,
      typeOperationBatch: EPlantProcess.MILLING
    });
    this.batches.set(batches);
  }

  private readonly millingsQuery = injectQuery(() => {
    return {
      queryKey: ['millings'],
      queryFn: () => this.fetchMillings(),
      enabled: true,
      refetchOnMount: 'always'
    };
  });

  private fetchMillings() {
    this.loadingService.startLoading('general');
    return lastValueFrom(
      this.millingManagementUsecase.getAll().pipe(
        takeUntilDestroyed(this.destroyRef),
        map((response: IGetMillsResponseEntity) => {
          return response.data;
        }),
        finalize(() => this.loadingService.stopLoading('general'))
      )
    );
  }

  private fetchSuppliers() {
    this.catalogsUseCase
      .execute('SUPPLIERS')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(response => {
          this.suppliers.set(response.data);
        })
      )
      .subscribe();
  }

  private async fetchBatches(params: IListBatchesParamsEntity) {
    return lastValueFrom(
      this.suppliersUseCase.getBatches(params).pipe(
        takeUntilDestroyed(this.destroyRef),
        map(res => {
          return res.data ?? [];
        })
      )
    );
  }

  private async fetchMines(supplierId: string) {
    return lastValueFrom(
      this.minesUsecase.getMinesBySupplierId(supplierId).pipe(
        takeUntilDestroyed(this.destroyRef),
        map(res => {
          return res.data;
        })
      )
    );
  }
}
