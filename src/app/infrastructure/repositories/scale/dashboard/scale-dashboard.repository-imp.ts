import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { ScaleDashboardRepository } from "@/domain/repositories/scale/dashboard/scale-dashboard.repository";
import { ScaleDashboardDatasourceService } from "@/infrastructure/datasources/scale/dashboard/scale-dashboard-datasource.service";
import { IDashboardFiltersEntity, IStockByLocationFiltersEntity } from "@/domain/entities/scale/dashboard/dashboard-filters.entity";
import { IMovementsDashboardEntity, IStockByLocationEntity, IWeighbridgeDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";

@Injectable({
  providedIn: "root"
})
export class ScaleDashboardRepositoryImp extends ScaleDashboardRepository {
  private readonly datasource = inject(ScaleDashboardDatasourceService);

  getDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IWeighbridgeDashboardEntity>> {
    return this.datasource.getDashboard(filters);
  }

  getStockByLocation(filters: IStockByLocationFiltersEntity): Observable<IGeneralResponse<IStockByLocationEntity>> {
    return this.datasource.getStockByLocation(filters);
  }

  getMovementsDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IMovementsDashboardEntity>> {
    return this.datasource.getMovementsDashboard(filters);
  }
}
