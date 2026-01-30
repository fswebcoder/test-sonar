import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { CitiesRepository } from "@/domain/repositories/common/cities.repository";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CitiesUseCase implements IGetAll<ICitiesResponseEntity> {
    private readonly citiesRepository = inject(CitiesRepository);

    getAll(): Observable<IGeneralResponse<ICitiesResponseEntity[]>> {
        return this.citiesRepository.getAll();
    }
}