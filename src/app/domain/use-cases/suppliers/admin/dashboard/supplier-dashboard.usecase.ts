import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SupplierDashboardRepository } from '@/domain/repositories/suppliers/admin/dashboard/supplier-dashboard.repository';
import { ISupplierDashboardQuery, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';

@Injectable({
  providedIn: 'root'
})
export class SupplierDashboardUsecase extends SupplierDashboardRepository {
  private readonly repo = inject(SupplierDashboardRepository);

  getDashboard(query?: ISupplierDashboardQuery): Observable<ISupplierDashboardResponse> {
    return this.repo.getDashboard(query);
  }
}
