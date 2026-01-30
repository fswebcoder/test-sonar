import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { DepartmentsRepository } from "@/domain/repositories/common/departments.repository";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DepartmentsUseCase implements IGetAll<IDepartmentsResponseEntity> {
    private readonly departmentsRepository = inject(DepartmentsRepository);

    getAll(): Observable<IGeneralResponse<IDepartmentsResponseEntity[]>> {
        return this.departmentsRepository.getAll();
    }
}