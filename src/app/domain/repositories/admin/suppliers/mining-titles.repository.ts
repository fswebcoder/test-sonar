import { IMiningTitlesEntity } from "@/domain/entities/admin/suppliers/mining-titles.entity";
import { IMiningTitlesParamsEntity } from "@/domain/entities/admin/suppliers/minint-titles-params.entity";
import { IMiningTitlesResponseEntity } from "@/domain/entities/admin/suppliers/mining-titles-response.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export abstract class MiningTitlesRepository implements IGetAll<IMiningTitlesEntity, false> {
    abstract getAll(params?: IMiningTitlesParamsEntity): Observable<IMiningTitlesResponseEntity>;
}