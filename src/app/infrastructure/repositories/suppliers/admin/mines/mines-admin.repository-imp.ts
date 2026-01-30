import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { MinesAdminRepository } from "@/domain/repositories/suppliers/admin/mines/mines-admin.repository";
import { MinesAdminDatasourceService } from "@/infrastructure/datasources/suppliers/admin/mines/mines-admin-datasource.service";
import { IListMinesResponseEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-response.entity";
import { IListMinesBySupplierResponseEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-by-supplier-response.entity";
import { IListMinesParamsEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-params.entity";
import { IGetMineResponseEntity } from "@/domain/entities/suppliers/admin/mines/get-mine-response.entity";
import { ICreateMineParamsEntity } from "@/domain/entities/suppliers/admin/mines/create-mine-params.entity";
import { IUpdateMineParamsEntity } from "@/domain/entities/suppliers/admin/mines/update-mine-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

@Injectable({
  providedIn: "root"
})
export class MinesAdminRepositoryImp extends MinesAdminRepository {
  private readonly datasource = inject(MinesAdminDatasourceService);

  getAll(params: IListMinesParamsEntity): Observable<IListMinesResponseEntity> {
    return this.datasource.getAll(params);
  }

  getMinesBySupplierId(supplierId: string): Observable<IListMinesBySupplierResponseEntity> {
    return this.datasource.getMinesBySupplierId(supplierId);
  }

  getMineById(mineId: string): Observable<IGetMineResponseEntity> {
    return this.datasource.getMineById(mineId);
  }

  create(params: ICreateMineParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.create(params);
  }

  update(params: IUpdateMineParamsEntity): Observable<IEmptyResponse> {
    return this.datasource.update(params);
  }

  activate(mineId: string): Observable<IEmptyResponse> {
    return this.datasource.activate(mineId);
  }

  inactivate(mineId: string): Observable<IEmptyResponse> {
    return this.datasource.inactivate(mineId);
  }
}
