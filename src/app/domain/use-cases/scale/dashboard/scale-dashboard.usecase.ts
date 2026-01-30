import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { ScaleDashboardRepository } from "@/domain/repositories/scale/dashboard/scale-dashboard.repository";
import { IDashboardFiltersEntity, IStockByLocationFiltersEntity } from "@/domain/entities/scale/dashboard/dashboard-filters.entity";
import { IMovementsDashboardEntity, IStockByLocationEntity, IWeighbridgeDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";

@Injectable({
    providedIn: "root"
})
export class ScaleDashboardUsecase {
  private readonly repository = inject(ScaleDashboardRepository);

  getDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IWeighbridgeDashboardEntity>> {
    return this.repository.getDashboard(filters);
  }

  getStockByLocation(filters: IStockByLocationFiltersEntity): Observable<IGeneralResponse<IStockByLocationEntity>> {
    return this.repository.getStockByLocation(filters);
  }

  getMovementsDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IMovementsDashboardEntity>> {
    return this.repository.getMovementsDashboard(filters);
  }
}
