import { Component, inject, signal, ViewChild } from '@angular/core';
import { ShiftConfigDumpComponent } from "../shift-config-dump/shift-config-dump.component";
import { Store } from '@ngrx/store';
import { IShiftConfigEntity } from '@/domain/entities/common/shift.entity';
import { getPersonnel, getPersonnelPositions, getShiftsConfig } from '@/store/selectors/common/common.selectors';
import ShiftConfigUseCase from '@/domain/use-cases/plant/shift/shift-config.usecase';
import { IGeneralResponse, ToastCustomService } from '@SV-Development/utilities';
import { catchError, finalize, of, tap } from 'rxjs';
import { IAreasOfOperationConfig } from '@/domain/entities/plant/shift/shift.entity';
import { LoadingService } from '@/shared/services/loading.service';
import IPersonnelPosition from '@/domain/entities/common/personnel-position.entity';
import IPersonnelCatalogEntity from '@/domain/entities/common/personnel.entity';
import { IAddPersonnelShiftConfigParamsEntity } from '@/domain/entities/plant/shift/add-personel-params.entity';
import { HttpErrorResponse } from '@angular/common/http';
import { IDeleteShiftPersonnelConfigParamsEntity } from '@/domain/entities/plant/shift/delete-shift-personnel-params.entity';
import { IEmptyResponse } from '@/shared/interfaces/empty-response.interface';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';


@Component({
  selector: 'svi-shift-config-smart',
  imports: [ShiftConfigDumpComponent],
  templateUrl: './shift-config-smart.component.html',
  styleUrl: './shift-config-smart.component.scss'
})
export class ShiftConfigSmartComponent {

  store = inject(Store)
  shiftConfigUseCase = inject(ShiftConfigUseCase)
  toastService = inject(ToastCustomService)
  loadingService = inject(LoadingService)

  shifts = signal<IShiftConfigEntity[]>([]);
  shiftConfig = signal<IAreasOfOperationConfig[] | null>(null);
  personnel = signal<IPersonnelCatalogEntity[]>([]);
  personnelPositions = signal<IPersonnelPosition[]>([]);
  selectedShift = signal<string | null>(null);

  @ViewChild('shiftConfigDump') shiftConfigDump!: ShiftConfigDumpComponent;

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.store.select(getShiftsConfig).subscribe(shiftsState => {
      this.shifts.set(shiftsState);
    });
    this.store.select(getPersonnel).subscribe(personnel => {
      this.personnel.set(personnel);
    });
    this.store.select(getPersonnelPositions).subscribe(positions => {
      this.personnelPositions.set(positions);
    });
  }

  shiftChanges(shiftId: string) {
    this.selectedShift.set(shiftId);
    this.fetchShiftConfig(shiftId);
  }

  addPersonnel(event: IAddPersonnelShiftConfigParamsEntity) {
    this.loadingService.setButtonLoading("add-personnel-button", true);
    this.shiftConfigUseCase.addPersonnel(event).pipe(
      tap((res: IEmptyResponse) => {
        this.processResponse(res, false);
        this.fetchShiftConfig(this.selectedShift()!);
        this.clearAndCloseForms();
      }),
      catchError(error => {
        this.processResponse(error, true);
        this.loadingService.setButtonLoading("add-personnel-button", false);
        return of(null);
      }),
      finalize(() => this.loadingService.setButtonLoading("add-personnel-button", false))
    ).subscribe();
  }

  deletePersonnel(event: IDeleteShiftPersonnelConfigParamsEntity) {
    this.loadingService.startLoading("general");
    this.shiftConfigUseCase.deletePersonnel(event).pipe(
      tap((res: IEmptyResponse) => {
        this.processResponse(res, false);
        if (this.selectedShift()) {
          this.fetchShiftConfig(this.selectedShift()!);
        }
      }),
      catchError(error => {
        this.processResponse(error, true);
        return of(null);
      }),
      finalize(() => this.loadingService.stopLoading("general"))
    ).subscribe();
  }

  private fetchShiftConfig(shiftId: string) {
    this.loadingService.startLoading("general");
    this.shiftConfigUseCase.getShiftConfig(shiftId).pipe(
      tap(shiftConfig => this.shiftConfig.set(shiftConfig.data ?? [])),
      catchError(error => {
        this.processResponse(error, true);
        return of(null);
      }),
      finalize(() => this.loadingService.stopLoading("general"))
    ).subscribe();
  }

  private processResponse = (response: IGeneralResponse<unknown> | HttpErrorResponse, isError: Boolean) => {
    let error = response as HttpErrorResponse;
    if(isError){
      this.toastService.error(error.error.message ?? ERROR_OPERATION_TITLE);
    }  else {
      this.toastService.success(response.message ?? SUCCESS_OPERATION_TITLE);
    }
  }

  private clearAndCloseForms(){
    this.shiftConfigDump.clearAndCloseForms();
  }

}
