import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FireAssayDumpComponent } from '../fire-assay-dump/fire-assay-dump.component';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom, takeUntil } from 'rxjs';
import FurnaceUseCase from '@/domain/use-cases/lims/furnaces/furnace.usecase';
import { EFurnaceTypes } from '@/shared/enums/furnace-types.enum';
import IFurnaceEntity from '@/domain/entities/lims/furnaces/furnace.entity';
import FireAssayUseCase from '@/domain/use-cases/lims/analysis/fire-assay.usecase';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import { IStartSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/start-smelting-params.entity';
import { IFinishSmeltingParams } from '@/domain/entities/lims/analysis/fire-assay/finish-smelting-params.entity';
import { ISmeltingActivityData } from '@/domain/entities/lims/analysis/fire-assay/smelting-activity-response.entity';
import { IStartCupellationParams } from '@/domain/entities/lims/analysis/fire-assay/start-cupellation-params.entity';
import { IFinishCupellationParams } from '@/domain/entities/lims/analysis/fire-assay/finish-cupellation-params.entity';

@Component({
  selector: 'svi-fire-assay-smart',
  imports: [FireAssayDumpComponent],
  templateUrl: './fire-assay-smart.component.html',
  styleUrl: './fire-assay-smart.component.scss'
})
export class FireAssaySmartComponent {
  private readonly furnaceUseCase = inject(FurnaceUseCase);
  private readonly fireAssayUseCase = inject(FireAssayUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastCustomService);
  furnaceActivity = signal<any | null>(null);
  finishedSmeltings = signal<ISmeltingActivityData[]>([]);
  activeCupellation = signal<ISmeltingActivityData | null>(null);
  cupellationClearKey = signal<number>(0);
  smeltingClearKey = signal<number>(0);

  private readonly furnacesQuery = injectQuery(() => ({
    queryKey: ['furnaces'],
    queryFn: () => this.fetchFurnaces(),
    enabled: true
  }));

  readonly furnacesQueryData = computed(() => {
    const data = this.furnacesQuery.data();
    return data ? data : { fundicion: [], copelacion: [] };
  });

  fetchFurnaces(): Promise<{ fundicion: IFurnaceEntity[]; copelacion: IFurnaceEntity[] }> {
    const promises = Promise.all([
      lastValueFrom(
        this.furnaceUseCase.getAllFurnaces({
          furnaceType: EFurnaceTypes.FUNDICION
        })
      ),
      lastValueFrom(
        this.furnaceUseCase.getAllFurnaces({
          furnaceType: EFurnaceTypes.COPELACION
        })
      )
    ]);
    return promises.then(([fundicion, copelacion]) => {
      return {
        fundicion: fundicion?.data ?? [],
        copelacion: copelacion?.data ?? []
      };
    });
  }


  smeltingFurnaceChange(furnaceId: string) {
  this.resetCupellationState();
  this.fetchFurnaceActivity(furnaceId, false);
  }

  cupellationFurnaceChange(furnaceId: string) {
  this.resetSmeltingState();
    this.fireAssayUseCase
      .getActiveCupellation(furnaceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: activeResp => this.handleActiveCupellationResponse(activeResp),
        error: (error: HttpErrorResponse) => this.handleActiveCupellationError(error)
      });
  }

  private loadFinishedSmeltings(showToast = false) {
    this.fireAssayUseCase
      .getFinishedSmelting()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.processFinishedSmeltingResponse(response, showToast),
        error: error => this.processActivityError(error, showToast)
      });
  }

  private processFinishedSmeltingResponse(response: IGeneralResponse<any>, showToast: boolean) {
    if (showToast) {
      this.toastService.success(response.message);
    }
    this.finishedSmeltings.set(response.data);
  }

  private processActivityResponse(response: IGeneralResponse<any>, showToast: boolean) {
    if (showToast) {
      this.toastService.success(response.message);
    }
    this.furnaceActivity.set(response.data);
  }

  private processActivityError(error: HttpErrorResponse, showToast: boolean) {
    if (showToast) {
      this.toastService.error(error.error.message);
    }
  }

  startSmelting(params: IStartSmeltingParams) {
    this.execute(
      this.fireAssayUseCase.startSmelting(params),
      () => {
        this.furnaceActivity.set(null);
  this.smeltingClearKey.update(v => v + 1);
      }
    );
  }

  finishSmelting(params: IFinishSmeltingParams) {
    this.execute(
      this.fireAssayUseCase.finishSmelting(params),
      () => {
        this.furnaceActivity.set(null);
  this.smeltingClearKey.update(v => v + 1);
  this.loadFinishedSmeltings(false);
      }
    );
  }

  startCupellation(params: IStartCupellationParams) {
    this.execute(
      this.fireAssayUseCase.startCupellation(params),
      () => {
        this.activeCupellation.set(null);
        this.cupellationClearKey.update(v => v + 1);
        this.loadFinishedSmeltings(false);
      }
    );
  }

  finishCupellation(params: IFinishCupellationParams) {
    this.execute(
      this.fireAssayUseCase.finishCupellation(params),
      () => {
        this.activeCupellation.set(null);
        this.cupellationClearKey.update(v => v + 1);
        this.loadFinishedSmeltings(true);
      }
    );
  }

  private execute(obs: any, onSuccess: () => void) {
    obs
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: IGeneralResponse<any>) => {
          this.toastService.success(response.message);
          onSuccess();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.toastService.error(error.error.message)
        }
      });
  }

  private fetchFurnaceActivity(furnaceId: string, showToast: boolean) {
    this.fireAssayUseCase
      .getFurnaceActivity({ smeltingFurnaceId: furnaceId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.processActivityResponse(response, showToast),
        error: error => this.processActivityError(error, showToast)
      });
  }

  private handleActiveCupellationResponse(activeResp: IGeneralResponse<any>) {
    const activeData = (activeResp as any)?.data ?? null;
    if (!activeData) {
      this.activeCupellation.set(null);
      this.loadFinishedSmeltings();
    } else {
      this.toastService.success(activeResp.message || 'Copelación activa cargada');
      this.activeCupellation.set(activeData);
      this.finishedSmeltings.set([activeData]);
    }
  }

  private handleActiveCupellationError(error: HttpErrorResponse) {
    this.toastService.error(error.error.message);
    this.activeCupellation.set(null);
    this.loadFinishedSmeltings();
  }

  private resetSmeltingState(){
    this.furnaceActivity.set(null);
    this.smeltingClearKey.update(v=>v+1);
  }

  private resetCupellationState(){
    this.activeCupellation.set(null);
    this.cupellationClearKey.update(v=>v+1);
  }
}
