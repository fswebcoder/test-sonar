import { Observable } from "rxjs";
import { ISamplesDropdownEntity } from "@/domain/entities/lims/management/samples-dropdown.entity";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";

export abstract class SamplesDropdownRepository {
    abstract getAll(params?: TPaginationParams): Observable<IGeneralResponse<ISamplesDropdownEntity>>;
}
