import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IGeneralResponse } from "@SV-Development/utilities";
import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { ENVIRONMENT } from "src/app.config";
import { IDashboardFiltersEntity, IStockByLocationFiltersEntity } from "@/domain/entities/scale/dashboard/dashboard-filters.entity";
import { IMovementsDashboardEntity, IStockByLocationEntity, IWeighbridgeDashboardEntity } from "@/domain/entities/scale/dashboard/dashboard-metrics.entity";

@Injectable({
  providedIn: "root"
})
export class ScaleDashboardDatasourceService extends BaseHttpService<undefined> {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}weight-register/dashboard/`;

  getDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IWeighbridgeDashboardEntity>> {
    const params = buildHttpParams({
      ...filters,
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString()
    });
    return this.get<IGeneralResponse<IWeighbridgeDashboardEntity>>("reception", { params });
  }

  getStockByLocation(filters: IStockByLocationFiltersEntity): Observable<IGeneralResponse<IStockByLocationEntity>> {
    const params = buildHttpParams({
      ...filters,
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString()
    });
    return this.get<IGeneralResponse<IStockByLocationEntity>>("stock", { params });
  }

  getMovementsDashboard(filters: IDashboardFiltersEntity): Observable<IGeneralResponse<IMovementsDashboardEntity>> {
    const params = buildHttpParams({
      ...filters,
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString()
    });
    return this.get<IGeneralResponse<IMovementsDashboardEntity>>("movements", { params });
  }
}
