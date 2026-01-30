import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SupplierDashboardRepository } from '@/domain/repositories/suppliers/admin/dashboard/supplier-dashboard.repository';
import { ISupplierDashboardQuery, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';
import { SupplierDashboardDatasourceService } from '@/infrastructure/datasources/suppliers/admin/dashboard/supplier-dashboard-datasource.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierDashboardRepositoryImp extends SupplierDashboardRepository {
  private readonly datasource = inject(SupplierDashboardDatasourceService);

  getDashboard(query?: ISupplierDashboardQuery): Observable<ISupplierDashboardResponse> {
    return this.datasource.getDashboard(query);
  }
}
