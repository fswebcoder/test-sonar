import MillingManagementUseCase from '@/domain/use-cases/plant/milling/milling-management.usecase';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MillingDetailDumpComponent } from '../milling-detail-dump/milling-detail-dump.component';
import { IMillingDetailEntity, IMillingRecordEntity } from '@/domain/entities/plant/milling/milling-detail.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, tap, Observable } from 'rxjs';
import { IGetMillingDetailResponseEntity } from '@/domain/entities/plant/milling/get-milling-detail-response.entity';
import { IMillingDetailShiftEntity } from '@/domain/entities/plant/milling/milling-detail-shift.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { ToastCustomService } from '@SV-Development/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_OPERATION_TITLE, SUCCESS_OPERATION_TITLE } from '@/shared/constants/general.contant';

@Component({
  selector: 'svi-milling-detail-smart',
  templateUrl: './milling-detail-smart.component.html',
  styleUrl: './milling-detail-smart.component.scss',
  imports: [MillingDetailDumpComponent]
})
export class MillingDetailSmartComponent implements OnInit {
  private readonly millingManagementUsecase = inject(MillingManagementUseCase);

  shiftId = signal<string | undefined>(undefined);
  selectedDate = signal<string | undefined>(undefined);

  currentDetails = signal<IMillingRecordEntity[] | null>(null);
  shifts = signal<IMillingDetailShiftEntity[]>([]);

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  ngOnInit(): void {
    this.listenQueryParams();
  }

  private listenQueryParams(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const normalized = this.normalizeParams(params);
        this.updateDate(normalized.date);

        this.shiftId.set(normalized.shiftId);

        if(normalized.shiftId) {
          this.fetchMillingDetails();
        } else {
          this.currentDetails.set(null);
        }
      });
  }
  
  private normalizeParams(params: any) {
    return {
      shiftId: params['shiftId'] || undefined,
      date: params['date'] || undefined,
    };
  }

  private updateDate(newDate?: string): void {
    if (this.selectedDate() === newDate) return;

    this.selectedDate.set(newDate);

    if (newDate) {
      this.fetchShifts(newDate);
    } else {
      this.shifts.set([]);
    }
  }

  private fetchMillingDetails(): void {
    const request$ = this.millingManagementUsecase.getMillingDetail({
      shiftId: this.shiftId()
    });

    this.handleMillingDetailRequest(request$).subscribe();
  }

  private fetchShifts(date: string): void {
    this.millingManagementUsecase.getMillingDetailShifts(date)
      .pipe(takeUntilDestroyed(this.destroyRef),
        tap(res => {
          this.shifts.set(res.data);
        })
      )
      .subscribe();
  }

  getCurrentShiftDetail(): void {
    this.loadingService.startLoading('general');
    const request$ = this.millingManagementUsecase.getCurrentMillingDetailShift();

    this.handleMillingDetailRequest(request$)
      .pipe(finalize(() => this.loadingService.stopLoading('general')))
      .subscribe();
  }


  dateChange(date: string): void {
    const normalizedDate = date || undefined;

    this.updateQueryParams({ date: normalizedDate ?? null });

    this.selectedDate.set(normalizedDate);

    if (normalizedDate) {
      this.fetchShifts(normalizedDate);
    } else {
      this.shifts.set([]);
    }
  }

  onFiltersChange(filters: { shiftId?: string }): void {
    const normalizedShift = filters.shiftId ?? undefined;

    if (this.shiftId() === normalizedShift) {
      return;
    }

    this.updateQueryParams({
      shiftId: normalizedShift ?? null
    });
  }

  private updateQueryParams(partial: Partial<Record<'shiftId' | 'date', string | null>>): void {
    const current: Record<'shiftId' | 'date', string | null> = {
      shiftId: this.shiftId() ?? null,
      date: this.selectedDate() ?? null
    };

    const desired = { ...current };
    for (const key of Object.keys(partial) as Array<keyof typeof desired>) {
      const value = partial[key];
      if (value !== undefined) {
        desired[key] = value;
      }
    }

    const diffEntries = (Object.keys(desired) as Array<keyof typeof desired>)
      .filter(key => desired[key] !== current[key])
      .map(key => [key, desired[key]] as const);

    if (!diffEntries.length) {
      return;
    }

    const diff = Object.fromEntries(diffEntries) as Record<string, string | null>;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: diff,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private showSuccessToast(message?: string | null): void {
    this.toastService.success(message ?? SUCCESS_OPERATION_TITLE);
  }

  private showErrorToast(message?: string | null): void {
    this.toastService.error(message ?? ERROR_OPERATION_TITLE);
  }

  private handleMillingDetailRequest(source$: Observable<IGetMillingDetailResponseEntity>) {
    return source$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((res: IGetMillingDetailResponseEntity) => {
        this.currentDetails.set(this.flattenRecords(res.data));
        this.showSuccessToast(res.message);
      }),
      catchError((error: HttpErrorResponse) => {
        this.showErrorToast(error.error?.message);
        return EMPTY;
      })
    );
  }

  private flattenRecords(details: IMillingDetailEntity[] | null | undefined): IMillingRecordEntity[] {
    if (!details?.length) {
      return [];
    }

    return details.flatMap(detail =>
      (detail.millingRecords ?? []).map(record => ({
        ...record,
        mill: record.mill ?? detail.mill
        ,
        millControlTracking: record.millControlTracking ?? detail.millControlTracking
      }))
    );
  }
}
