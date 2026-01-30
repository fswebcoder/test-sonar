import { IActionEntity } from "@/domain/entities/common/action.entity";
import { IActionsResponseEntity } from "@/domain/entities/common/actions-response.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export abstract class ActionsRepository implements IGetAll<IActionEntity, false> {

    abstract getAll(): Observable<IActionsResponseEntity>;
    
}