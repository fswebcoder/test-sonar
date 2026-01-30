import { SamplesDropdownDatasourceService } from "@/infrastructure/datasources/lims/management/samples-dropdown-datasource.service";
import { inject, Injectable } from "@angular/core";
import { SamplesDropdownRepository } from "@/domain/repositories/lims/management/samples-dropdown.repository";
import { ISamplesDropdownEntity } from "@/domain/entities/lims/management/samples-dropdown.entity";
import { IParamsDate } from "@/shared/interfaces/params-date.interface";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SamplesDropdownRepositoryImp implements SamplesDropdownRepository {

    private readonly samplesDropdownDatasourceService = inject(SamplesDropdownDatasourceService);

    getAll(params: IParamsDate): Observable<IGeneralResponse<ISamplesDropdownEntity>> {
        return this.samplesDropdownDatasourceService.getAll(params);
    }
}