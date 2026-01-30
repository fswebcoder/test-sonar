import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { IDashboardFiltersEntity, IStockByLocationFiltersEntity } from "@/domain/entities/scale/dashboard/dashboard-filters.entity";
import { IMovementsDashboardEntity, IStockByLocationEntity, IWeighbridgeDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";

export abstract class ScaleDashboardRepository {
  abstract getDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IWeighbridgeDashboardEntity>>;
  abstract getStockByLocation(filters: IStockByLocationFiltersEntity): Observable<IGeneralResponse<IStockByLocationEntity>>;
  abstract getMovementsDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IMovementsDashboardEntity>>;
}
