import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, Subject } from 'rxjs';

import { SupplierDashboardDumpComponent } from '../supplier-dashboard-dump/supplier-dashboard-dump.component';
import { SupplierDashboardUsecase } from '@/domain/use-cases/suppliers/admin/dashboard/supplier-dashboard.usecase';
import { ChartGroupBy, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';
import { LoadingService } from '@/shared/services/loading.service';
import { SUPPLIER_DASHBOARD_LOADING } from '../supplier-dashboard.loading';
import { ToastCustomService } from '@SV-Development/utilities';

@Component({
  selector: 'svi-supplier-dashboard-smart',
  standalone: true,
  imports: [SupplierDashboardDumpComponent],
  templateUrl: './supplier-dashboard-smart.component.html'
})
export class SupplierDashboardSmartComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardUsecase = inject(SupplierDashboardUsecase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastCustomService);

  private readonly filterChange$ = new Subject<void>();

  readonly LOADING = SUPPLIER_DASHBOARD_LOADING;

  dashboard = signal<ISupplierDashboardResponse | null>(null);
  isLoadingRefresh = signal<boolean>(false);

  startDate = signal<Date | null>(this.getDefaultStartDate());
  endDate = signal<Date | null>(new Date());
  groupBy = signal<ChartGroupBy>(ChartGroupBy.DAY);

  ngOnInit(): void {
    this.setupFilterDebounce();
    this.loadDashboard();
  }

  private setupFilterDebounce(): void {
    this.filterChange$
      .pipe(
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadDashboard();
      });
  }

  onStartDateChange(date: Date | null): void {
    this.startDate.set(date);
    this.filterChange$.next();
  }

  onEndDateChange(date: Date | null): void {
    this.endDate.set(date);
    this.filterChange$.next();
  }

  onGroupByChange(groupBy: ChartGroupBy): void {
    this.groupBy.set(groupBy);
    this.filterChange$.next();
  }

  onRefresh(): void {
    this.loadDashboard(true);
  }

  private loadDashboard(isRefresh = false): void {
    if (isRefresh) {
      this.isLoadingRefresh.set(true);
    } else {
      this.loadingService.startLoading('general');
    }

    this.dashboardUsecase
      .getDashboard({
        startDate: this.startDate() ?? undefined,
        endDate: this.endDate() ?? undefined,
        groupBy: this.groupBy()
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingService.stopLoading('general');
          this.isLoadingRefresh.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.dashboard.set(response);
        },
        error: (error) => {
          console.error('Error loading dashboard:', error);
          this.toastService.error(error.error?.message || 'No se pudo cargar el dashboard. Intente nuevamente.');
        }
      });
  }

  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }
}
