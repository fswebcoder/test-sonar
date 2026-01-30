import { BaseHttpService } from "@/core/providers/base-http.service";
import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { DepartmentsRepository } from "@/domain/repositories/common/departments.repository";
import { inject, Injectable } from "@angular/core";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class DepartmentsListDatasourceService extends BaseHttpService<IDepartmentsResponseEntity[]> implements DepartmentsRepository {
    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}common/catalogs/`;

    getAll(): Observable<IGeneralResponse<IDepartmentsResponseEntity[]>> {
        return this.get<IGeneralResponse<IDepartmentsResponseEntity[]>>(`DEPARTMENTS`);
    }
}