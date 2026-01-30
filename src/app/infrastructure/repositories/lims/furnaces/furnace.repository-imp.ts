import IFurnaceParams from "@/domain/entities/lims/furnaces/furnace-params.entity";
import IFurnaceResponseEntity from "@/domain/entities/lims/furnaces/furnace-response.entity";
import FurnaceRepository from "@/domain/repositories/lims/furnaces/furnace.repository";
import FurnaceDataSourceService from "@/infrastructure/datasources/lims/furnaces/furnace-datasource.service";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export default class FurnaceRepositoryImp implements FurnaceRepository {
  private furnaceDatasource = inject<FurnaceDataSourceService>(FurnaceDataSourceService);
  
  getAll(params: IFurnaceParams): Observable<IFurnaceResponseEntity> {
    return this.furnaceDatasource.getAll(params);
  }
}