import { BaseHttpService } from "@/core/providers/base-http.service";
import { ICitiesResponseEntity } from "@/domain/entities/common/cities-response.entity";
import { CitiesRepository } from "@/domain/repositories/common/cities.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class CitiesDatasourceService extends BaseHttpService<ICitiesResponseEntity[]> implements CitiesRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}common/catalogs/`;

    getAll(): Observable<IGeneralResponse<ICitiesResponseEntity[]>> {
        return this.get<IGeneralResponse<ICitiesResponseEntity[]>>(`CITIES`);
    }
}