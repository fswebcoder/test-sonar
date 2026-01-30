import IFurnaceParams from "@/domain/entities/lims/furnaces/furnace-params.entity";
import IFurnaceResponseEntity from "@/domain/entities/lims/furnaces/furnace-response.entity";
import FurnaceRepository from "@/domain/repositories/lims/furnaces/furnace.repository";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export default class FurnaceUseCase {
  private readonly furnaceRepository = inject(FurnaceRepository);

  getAllFurnaces(params: IFurnaceParams): Observable<IFurnaceResponseEntity> {
    return this.furnaceRepository.getAll(params);
  }
}