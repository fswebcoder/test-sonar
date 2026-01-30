import { BaseHttpService } from "@/core/providers/base-http.service";
import IFurnaceParams from "@/domain/entities/lims/furnaces/furnace-params.entity";
import IFurnaceResponseEntity from "@/domain/entities/lims/furnaces/furnace-response.entity";
import FurnaceRepository from "@/domain/repositories/lims/furnaces/furnace.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: 'root'
})
export default class FurnaceDataSourceService extends BaseHttpService<IFurnaceResponseEntity> implements FurnaceRepository{
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}furnace/`;

  getAll(params: IFurnaceParams): Observable<IFurnaceResponseEntity> {
    return this.http.get<IFurnaceResponseEntity>(`${this.baseUrl}${params.furnaceType}`);
  }
}