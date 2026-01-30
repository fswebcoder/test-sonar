import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { CurrentShiftDumpComponent } from '../current-shift-dump/current-shift-dump.component';
import IShiftEntity from '@/domain/entities/plant/shift/shift.entity';
import CurrentShiftUseCase from '@/domain/use-cases/plant/shift/current-shift.usecase';
import { catchError, finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from '@/shared/services/loading.service';
import { Store } from '@ngrx/store';
import { getPersonnel, getPersonnelPositions } from '@/store/selectors/common/common.selectors';
import IPersonnelEntity from '@/domain/entities/common/personnel.entity';
import IPersonnelPosition from '@/domain/entities/common/personnel-position.entity';
import { IAddPersonnelParamsEntity } from '@/domain/entities/plant/shift/add-personel-params.entity';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import { IDeleteShiftPersonnelParamsEntity } from '@/domain/entities/plant/shift/delete-shift-personnel-params.entity';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'svi-current-shift-smart',
  imports: [CurrentShiftDumpComponent],
  templateUrl: './current-shift-smart.component.html',
  styleUrls: ['./current-shift-smart.component.scss']
})
export class CurrentShiftSmartComponent {

  currentShiftUseCase: CurrentShiftUseCase = inject(CurrentShiftUseCase);
  destroyRef = inject(DestroyRef);
  loadingService = inject(LoadingService);
  store = inject(Store);
  toastService = inject(ToastCustomService)

  personnel = signal<IPersonnelEntity[]>([]);
  personnelPositions = signal<IPersonnelPosition[]>([]);

  currentShift = signal<IShiftEntity | null | undefined>(undefined);

  @ViewChild('currentShiftDumpComponent') currentShiftDumpComponent!: CurrentShiftDumpComponent;

  ngOnInit() {
    this.fetchCurrentShift()
    this.loadInitialData()
  }


  openShift() {
    this.loadingService.startLoading("general");
    this.currentShiftUseCase.create().pipe(
      finalize(() => {
        this.loadingService.stopLoading("general");
      }),
      tap((response) => this.processResponse(response, false)),
      catchError((error:HttpErrorResponse) => {
        this.processResponse(error.error, true);
        return [];
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  closeShift() {
    this.loadingService.startLoading("general");
    this.currentShiftUseCase.closeShift().pipe(
      finalize(() => {
        this.loadingService.stopLoading("general");
      }),
      tap((response) => this.processResponse(response, false)),
      catchError((error: HttpErrorResponse) => {
        this.processResponse(error.error, true);
        return [];
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  deletePersonnel(event: IDeleteShiftPersonnelParamsEntity) {
    this.loadingService.startLoading("general");
    this.currentShiftUseCase.deletePersonnel(event).pipe(
      finalize(() => {
        this.loadingService.stopLoading("general");
      }),
      tap((response) => this.processResponse(response, false)),
      catchError((error: HttpErrorResponse) => {
        this.processResponse(error.error, true);
        return [];
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  addPersonnel(event: IAddPersonnelParamsEntity) {
    this.loadingService.setButtonLoading("add-personnel-button", true);
    this.currentShiftUseCase.addPersonnel(event).pipe(
      finalize(() => {
        this.loadingService.setButtonLoading("add-personnel-button", false);
      }),
      tap((response) => this.processResponse(response, false)),
      catchError((error: HttpErrorResponse) => {
        this.processResponse(error.error, true);
        return [];
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private processResponse = (response: IGeneralResponse<unknown>, isError: Boolean) => {
    if (isError) {
      this.toastService.error(response.message ?? ERROR_OPERATION_TITLE);
    } else {
      this.fetchCurrentShift();
      this.toastService.success(response.message ?? SUCCESS_OPERATION_TITLE);
    }
    this.currentShiftDumpComponent.clearAndCloseDialog();
  }

  private loadInitialData() {
    this.store.select(getPersonnel).subscribe(personnel => {
      this.personnel.set(personnel);
    });
    this.store.select(getPersonnelPositions).subscribe(positions => {
      this.personnelPositions.set(positions);
    });
  }

  private fetchCurrentShift() {
    this.loadingService.startLoading("general");
    this.currentShiftUseCase.getCurrentShift().pipe(
      tap(shift => {
        this.currentShift.set(shift.data)
      }),
      takeUntilDestroyed(this.destroyRef),
      catchError((error: HttpErrorResponse) => {
        this.currentShift.set(null);
        this.processResponse(error.error, true);
        return [];
      }),
      finalize(() => this.loadingService.stopLoading("general"))
    ).subscribe();
  }
}
