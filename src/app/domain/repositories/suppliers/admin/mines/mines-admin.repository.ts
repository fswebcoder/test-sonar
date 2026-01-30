import { Observable } from "rxjs";

import { IListMinesResponseEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-response.entity";
import { IListMinesBySupplierResponseEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-by-supplier-response.entity";
import { IListMinesParamsEntity } from "@/domain/entities/suppliers/admin/mines/list-mines-params.entity";
import { IGetMineResponseEntity } from "@/domain/entities/suppliers/admin/mines/get-mine-response.entity";
import { ICreateMineParamsEntity } from "@/domain/entities/suppliers/admin/mines/create-mine-params.entity";
import { IUpdateMineParamsEntity } from "@/domain/entities/suppliers/admin/mines/update-mine-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

export abstract class MinesAdminRepository {
  abstract getAll(params: IListMinesParamsEntity): Observable<IListMinesResponseEntity>;
  abstract getMinesBySupplierId(supplierId: string): Observable<IListMinesBySupplierResponseEntity>;
  abstract getMineById(mineId: string): Observable<IGetMineResponseEntity>;
  abstract create(params: ICreateMineParamsEntity): Observable<IEmptyResponse>;
  abstract update(params: IUpdateMineParamsEntity): Observable<IEmptyResponse>;
  abstract activate(mineId: string): Observable<IEmptyResponse>;
  abstract inactivate(mineId: string): Observable<IEmptyResponse>;
}
