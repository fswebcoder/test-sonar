import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

import { SupplierDashboardRepository } from '@/domain/repositories/suppliers/admin/dashboard/supplier-dashboard.repository';
import { ISupplierDashboardQuery, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';
import { SingleOrListResponse } from '@/shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierDashboardDatasourceService extends SupplierDashboardRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  private readonly apiUrlBase = `${this.env.services.security}weight-register-supplier`;

  getDashboard(query?: ISupplierDashboardQuery): Observable<ISupplierDashboardResponse> {
    let params = new HttpParams();

    if (query?.startDate) {
      params = params.set('startDate', query.startDate.toISOString().split('T')[0]);
    }
    if (query?.endDate) {
      params = params.set('endDate', query.endDate.toISOString().split('T')[0]);
    }
    if (query?.groupBy) {
      params = params.set('groupBy', query.groupBy);
    }

    return this.http.get<SingleOrListResponse<ISupplierDashboardResponse, true>>(`${this.apiUrlBase}/dashboard`, { params }).pipe(
      map(response => response.data)
    );
  }
}
