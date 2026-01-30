import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { IMineEntity } from '@/domain/entities/suppliers/admin/mines/mine.entity';
import { ICreateMineParamsEntity } from '@/domain/entities/suppliers/admin/mines/create-mine-params.entity';
import { IUpdateMineParamsEntity } from '@/domain/entities/suppliers/admin/mines/update-mine-params.entity';
import { MinesAdminUseCase } from '@/domain/use-cases/suppliers/admin/mines/mines-admin.usecase';
import { LoadingService } from '@/shared/services/loading.service';
import { PaginationService } from '@/shared/services/pagination.service';
import { PaginatedData, ToastCustomService, TPaginationParams } from '@SV-Development/utilities';
import { ERROR_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { MinesDumpComponent } from '../mines-dump/mines-dump.component';

@Component({
  selector: 'svi-mines-smart',
  templateUrl: './mines-smart.component.html',
  styleUrl: './mines-smart.component.scss',
  imports: [MinesDumpComponent]
})
export class MinesSmartComponent implements OnInit {

  private readonly minesAdminUseCase = inject(MinesAdminUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly paginationService = inject(PaginationService);
  private readonly toastService = inject(ToastCustomService);

  @ViewChild('minesDump') minesDumpComponent!: MinesDumpComponent;

  private readonly minesData = signal<PaginatedData<IMineEntity> | null>(null);
  private isLoadingMines = false;

  minesQueryData = computed(() => {
    return this.minesData() || { items: [], meta: this.getDefaultMeta() };
  });

  minesItems = computed(() => {
    const data = this.minesQueryData();
    return data?.items || [];
  });

  minesMeta = computed(() => {
    const data = this.minesQueryData();
    return data?.meta || this.getDefaultMeta();
  });

  ngOnInit() {
    this.paginationService.resetPagination();
    this.loadMines();
  }

  private async loadMines() {
    if (this.isLoadingMines) return;

    this.isLoadingMines = true;
    this.loadingService.startLoading('general');
    try {
      const response = await lastValueFrom(
        this.minesAdminUseCase.getAll(this.paginationService.getPaginationParams())
      );
      this.paginationService.setTotalRecords(response.data?.meta?.total || 0);
      this.minesData.set(response.data);
    } catch (error) {
      this.handleQueryError(error as HttpErrorResponse);
    } finally {
      this.loadingService.stopLoading('general');
      this.isLoadingMines = false;
    }
  }

  paramsChange(params: TPaginationParams) {
    this.paginationService.updatePagination({
      ...this.paginationService.getPaginationParams(),
      ...params
    });
    this.loadMines();
  }

  private getDefaultMeta() {
    return {
      ...this.paginationService.getPaginationParams()
    };
  }

  private handleQueryError(error: HttpErrorResponse) {
    return error.status === 401 ? null : this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
  }

  createMine(data: ICreateMineParamsEntity) {
    this.loadingService.setButtonLoading('create-mine-button', true);
    this.minesAdminUseCase.create({ name: data.name }).subscribe({
      next: () => {
        this.toastService.success('Mina creada correctamente');
        this.minesDumpComponent?.closeAllDialogs();
        this.loadMines();
        this.loadingService.setButtonLoading('create-mine-button', false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.setButtonLoading('create-mine-button', false);
      }
    });
  }

  editMine(data: IUpdateMineParamsEntity) {
    this.loadingService.setButtonLoading('edit-mine-button', true);
    this.minesAdminUseCase.update(data).subscribe({
      next: () => {
        this.toastService.success('Mina actualizada correctamente');
        this.minesDumpComponent?.closeAllDialogs();
        this.loadMines();
        this.loadingService.setButtonLoading('edit-mine-button', false);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.setButtonLoading('edit-mine-button', false);
      }
    });
  }

  activateMine(mineId: string) {
    this.loadingService.startLoading('general');
    this.minesAdminUseCase.activate(mineId).subscribe({
      next: () => {
        this.toastService.success('Mina activada correctamente');
        this.loadMines();
        this.loadingService.stopLoading('general');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.stopLoading('general');
      }
    });
  }

  inactivateMine(mineId: string) {
    this.loadingService.startLoading('general');
    this.minesAdminUseCase.inactivate(mineId).subscribe({
      next: () => {
        this.toastService.success('Mina inactivada correctamente');
        this.loadMines();
        this.loadingService.stopLoading('general');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error?.message || ERROR_OPERATION_TITLE);
        this.loadingService.stopLoading('general');
      }
    });
  }
}
