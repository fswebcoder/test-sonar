import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
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
export class MinesAdminDatasourceService extends BaseHttpService<undefined> {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;

  getAll(params: IListMinesParamsEntity): Observable<IListMinesResponseEntity> {
    return this.get<IListMinesResponseEntity>('mines', { params: buildHttpParams(params) });
  }
  
  getMinesBySupplierId(supplierId: string): Observable<IListMinesBySupplierResponseEntity> {
    return this.get<IListMinesBySupplierResponseEntity>(`suppliers/mines/${supplierId}`);
  }

  getMineById(mineId: string): Observable<IGetMineResponseEntity> {
    return this.get<IGetMineResponseEntity>(`mines/${mineId}`);
  }

  create(params: ICreateMineParamsEntity): Observable<IEmptyResponse> {
    return this.post<IEmptyResponse>({ name: params.name }, "mines");
  }

  update(params: IUpdateMineParamsEntity): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>({ name: params.name }, `mines/${params.id}`);
  }

  activate(mineId: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>({}, `mines/${mineId}/activate`);
  }

  inactivate(mineId: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`mines/${mineId}`);
  }
}
