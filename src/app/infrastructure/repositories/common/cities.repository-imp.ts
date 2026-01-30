import { CitiesRepository } from "@/domain/repositories/common/cities.repository";
import { inject, Injectable } from "@angular/core";
import { CitiesDatasourceService } from "@/infrastructure/datasources/common/cities.datasource.service";
import { Observable } from "rxjs";
import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { IGeneralResponse } from "@SV-Development/utilities";

@Injectable({
    providedIn: 'root'
})
export class CitiesRepositoryImp implements CitiesRepository {
    private readonly citiesDatasourceService = inject(CitiesDatasourceService);

    getAll(): Observable<IGeneralResponse<ICitiesResponseEntity[]>> {
        return this.citiesDatasourceService.getAll();
    }
}