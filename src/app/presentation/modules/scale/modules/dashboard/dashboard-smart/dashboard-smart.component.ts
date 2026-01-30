import { Component, DestroyRef, OnInit, inject, signal, effect } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, finalize, merge, skip } from "rxjs";
import { Store } from "@ngrx/store";
import { IGeneralResponse, ToastCustomService } from "@SV-Development/utilities";

import { DashboardDumpComponent, DashboardTab } from "../dashboard-dump/dashboard-dump.component";

import { ScaleDashboardUsecase } from "@/domain/use-cases/scale/dashboard/scale-dashboard.usecase";
import { MinesAdminUseCase } from "@/domain/use-cases/suppliers/admin/mines/mines-admin.usecase";
import { LoadingService } from "@/shared/services/loading.service";
import {
  IMovementsDashboardEntity,
  IStockByLocationEntity,
  IWeighbridgeDashboardEntity
} from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";
import { IsupplierListResponseEntity } from "@/domain/entities/common/suppliers-list-response.entity";
import { IIdName } from "@/shared/interfaces/id-name.interface";
import { getSuppliers } from "@/store/selectors/common/common.selectors";
import { LOAD_DATA_ERROR_TITLE } from "@/shared/constants/general.contant";
import { DASHBOARD_LOADING } from "../dashboard.loading";

interface DashboardQueryParams {
  tab?: DashboardTab;
  startDate?: string;
  endDate?: string;
  supplierId?: string;
  mineId?: string;
}

@Component({
  selector: "svi-dashboard-smart",
  standalone: true,
  imports: [DashboardDumpComponent],
  templateUrl: "./dashboard-smart.component.html",
  styleUrl: "./dashboard-smart.component.scss"
})
export class DashboardSmartComponent implements OnInit {
  private readonly dashboardUsecase = inject(ScaleDashboardUsecase);
  private readonly minesUsecase = inject(MinesAdminUseCase);
  private readonly loadingService = inject(LoadingService);
  private readonly toastCustomService = inject(ToastCustomService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  receptionsData = signal<IWeighbridgeDashboardEntity | null>(null);
  movementsData = signal<IMovementsDashboardEntity | null>(null);
  stockData = signal<IStockByLocationEntity | null>(null);
  suppliersOptions = signal<IsupplierListResponseEntity[]>([]);
  minesOptions = signal<IIdName[]>([]);

  activeTab = signal<DashboardTab>("receptions");

  startDateControl = new FormControl<Date>(this.getDefaultStartDate(), { nonNullable: true });
  endDateControl = new FormControl<Date>(new Date(), { nonNullable: true });
  supplierControl = new FormControl<string | null>(null);
  mineControl = new FormControl<string | null>(null);

  private isInitialized = false;

  constructor() {
    effect(() => {
      if (!this.isInitialized) return;
      
      this.activeTab();
      this.syncQueryParams();
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.initializeFromQueryParams();
    this.setupFormListeners();
  }

  private initializeFromQueryParams(): void {
    const params = this.route.snapshot.queryParams as DashboardQueryParams;

    if (params.tab && ["receptions", "movements", "stock"].includes(params.tab)) {
      this.activeTab.set(params.tab);
    }

    if (params.startDate) {
      const startDate = new Date(params.startDate);
      if (!Number.isNaN(startDate.getTime())) {
        this.startDateControl.setValue(startDate);
      }
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      if (!Number.isNaN(endDate.getTime())) {
        this.endDateControl.setValue(endDate);
      }
    }

    if (params.supplierId) {
      this.supplierControl.setValue(params.supplierId);
      this.loadMinesForSupplier(params.supplierId, params.mineId);
    }

    this.isInitialized = true;
    this.loadActiveTabData();
  }

  private setupFormListeners(): void {
    merge(
      this.startDateControl.valueChanges,
      this.endDateControl.valueChanges,
      this.supplierControl.valueChanges,
      this.mineControl.valueChanges
    )
      .pipe(
        skip(1),
        debounceTime(400),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.syncQueryParams();
        this.loadActiveTabData();
      });
  }

  private loadInitialData(): void {
    this.store.select(getSuppliers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(suppliers => this.suppliersOptions.set(suppliers ?? []));
  }

  private syncQueryParams(): void {
    const queryParams: DashboardQueryParams = {
      tab: this.activeTab(),
      startDate: this.startDateControl.value.toISOString().split("T")[0],
      endDate: this.endDateControl.value.toISOString().split("T")[0]
    };

    if (this.supplierControl.value) {
      queryParams.supplierId = this.supplierControl.value;
    }

    if (this.mineControl.value) {
      queryParams.mineId = this.mineControl.value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge",
      replaceUrl: true
    });
  }

  onTabChange(tab: DashboardTab): void {
    if (tab !== this.activeTab()) {
      this.activeTab.set(tab);
      this.loadActiveTabData();
    }
  }

  onSupplierChange(supplierId: string | null): void {
    this.mineControl.setValue(null);
    this.minesOptions.set([]);

    if (supplierId) {
      this.loadMinesForSupplier(supplierId);
    }
  }

  private loadMinesForSupplier(supplierId: string, preselectedMineId?: string): void {
    this.minesUsecase.getMinesBySupplierId(supplierId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          const mines = response.data ?? [];
          this.minesOptions.set(mines.map(m => ({ id: m.id, name: m.name })));
          
          if (preselectedMineId) {
            const mineExists = mines.some(m => m.id === preselectedMineId);
            if (mineExists) {
              this.mineControl.setValue(preselectedMineId);
            }
          }
        },
        error: () => this.minesOptions.set([])
      });
  }

  private loadActiveTabData(): void {
    const tab = this.activeTab();

    switch (tab) {
      case "receptions":
        this.loadReceptionsData();
        break;
      case "movements":
        this.loadMovementsData();
        break;
      case "stock":
        this.loadStockData();
        break;
    }
  }

  private getFilters() {
    const startDate = this.startDateControl.value;
    const endDate = new Date(this.endDateControl.value);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate,
      endDate,
      supplierId: this.supplierControl.value ?? undefined,
      mineId: this.mineControl.value ?? undefined
    };
  }

  private loadReceptionsData(): void {
    this.loadingService.startLoading(DASHBOARD_LOADING.sections.receptions);

    this.dashboardUsecase
      .getDashboard(this.getFilters())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.stopLoading(DASHBOARD_LOADING.sections.receptions))
      )
      .subscribe({
        next: (response: IGeneralResponse<IWeighbridgeDashboardEntity>) => {
          this.receptionsData.set(response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.toastCustomService.error(
            LOAD_DATA_ERROR_TITLE,
            error.error?.message || "Error al cargar el dashboard de recepciones"
          );
        }
      });
  }

  private loadMovementsData(): void {
    this.loadingService.startLoading(DASHBOARD_LOADING.sections.movements);

    this.dashboardUsecase
      .getMovementsDashboard(this.getFilters())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.stopLoading(DASHBOARD_LOADING.sections.movements))
      )
      .subscribe({
        next: (response: IGeneralResponse<IMovementsDashboardEntity>) => {
          this.movementsData.set(response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.toastCustomService.error(
            LOAD_DATA_ERROR_TITLE,
            error.error?.message || "Error al cargar el dashboard de movimientos"
          );
        }
      });
  }

  private loadStockData(): void {
    this.loadingService.startLoading(DASHBOARD_LOADING.sections.stock);

    const filters = {
      startDate: this.startDateControl.value,
      endDate: this.endDateControl.value,
      supplierId: this.supplierControl.value ?? undefined
    };

    this.dashboardUsecase
      .getStockByLocation(filters)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingService.stopLoading(DASHBOARD_LOADING.sections.stock))
      )
      .subscribe({
        next: (response: IGeneralResponse<IStockByLocationEntity>) => {
          this.stockData.set(response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.toastCustomService.error(
            LOAD_DATA_ERROR_TITLE,
            error.error?.message || "Error al cargar el stock por ubicación"
          );
        }
      });
  }

  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
