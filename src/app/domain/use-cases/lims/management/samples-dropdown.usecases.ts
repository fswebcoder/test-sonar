import { ISamplesDropdownEntity } from "@/domain/entities/lims/management/samples-dropdown.entity";
import { SamplesDropdownRepository } from "@/domain/repositories/lims/management/samples-dropdown.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SamplesDropdownUseCase implements SamplesDropdownRepository {
    private readonly samplesDropdownRepository = inject(SamplesDropdownRepository);

    getAll(params?: TPaginationParams): Observable<IGeneralResponse<ISamplesDropdownEntity>> {
        return this.samplesDropdownRepository.getAll(params);
    }
}