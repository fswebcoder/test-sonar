import { Observable } from 'rxjs';
import { ISupplierDashboardQuery, ISupplierDashboardResponse } from '@/domain/entities/suppliers/admin/dashboard/supplier-dashboard.entity';

export abstract class SupplierDashboardRepository {
  abstract getDashboard(query?: ISupplierDashboardQuery): Observable<ISupplierDashboardResponse>;
}
