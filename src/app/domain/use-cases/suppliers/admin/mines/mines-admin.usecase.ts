import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { MinesAdminRepository } from "@/domain/repositories/suppliers/admin/mines/mines-admin.repository";
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
export class MinesAdminUseCase implements MinesAdminRepository {
  private readonly minesRepository = inject(MinesAdminRepository);

  getAll(params: IListMinesParamsEntity): Observable<IListMinesResponseEntity> {
    return this.minesRepository.getAll(params);
  }

  getMinesBySupplierId(supplierId: string): Observable<IListMinesBySupplierResponseEntity> {
    return this.minesRepository.getMinesBySupplierId(supplierId);
  }

  getMineById(mineId: string): Observable<IGetMineResponseEntity> {
    return this.minesRepository.getMineById(mineId);
  }

  create(params: ICreateMineParamsEntity): Observable<IEmptyResponse> {
    return this.minesRepository.create(params);
  }

  update(params: IUpdateMineParamsEntity): Observable<IEmptyResponse> {
    return this.minesRepository.update(params);
  }

  activate(mineId: string): Observable<IEmptyResponse> {
    return this.minesRepository.activate(mineId);
  }

  inactivate(mineId: string): Observable<IEmptyResponse> {
    return this.minesRepository.inactivate(mineId);
  }
}
