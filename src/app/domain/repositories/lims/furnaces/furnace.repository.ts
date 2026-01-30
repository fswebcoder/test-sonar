import IFurnaceParams from "@/domain/entities/lims/furnaces/furnace-params.entity";
import IFurnaceResponseEntity from "@/domain/entities/lims/furnaces/furnace-response.entity";
import IFurnaceEntity from "@/domain/entities/lims/furnaces/furnace.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default abstract class FurnaceRepository implements IGetAll<IFurnaceEntity, false> {
  abstract getAll(params: IFurnaceParams): Observable<IFurnaceResponseEntity>;
}