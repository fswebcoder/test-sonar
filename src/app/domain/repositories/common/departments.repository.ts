import { IDepartmentsResponseEntity } from "@/domain/entities/common/departments-response.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IGeneralResponse } from "@SV-Development/utilities";
import { Observable } from 'rxjs';

export abstract class DepartmentsRepository implements  IGetAll<IDepartmentsResponseEntity> {
    abstract getAll(): Observable<IGeneralResponse<IDepartmentsResponseEntity[]>>;
}
