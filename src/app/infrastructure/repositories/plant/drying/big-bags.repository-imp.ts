import { ICreateBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/create-big-bag-sending-order-params.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";
import { IFillBigBagResponseEntity } from "@/domain/entities/plant/drying/fill-big-bag-response.entity";
import { IListBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity";
import { IListBigBagSendingOrderResponseEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-response.entity";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";
import { IListBigBagsResponseEntity } from "@/domain/entities/plant/drying/list-big-bags-response.entity";
import { BigBagsRepository } from "@/domain/repositories/plant/drying/big-bags.repository";
import { BigBagsDatasourceService } from "@/infrastructure/datasources/plant/drying/big-bags-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BigBagsRepositoryImp implements BigBagsRepository {
    private readonly datasource: BigBagsDatasourceService = inject(BigBagsDatasourceService);

    getAll(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.datasource.getAll(params);
    }

    getAvailableBigBags(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.datasource.getAvailableBigBags(params);
    }

    fillBigBag(params: IFillBigBagParamsEntity): Observable<IFillBigBagResponseEntity> {
        return this.datasource.fillBigBag(params);
    }
    
    getBigBagSendingOrders(params: IListBigBagSendingOrderParamsEntity): Observable<IListBigBagSendingOrderResponseEntity> {
        return this.datasource.getBigBagSendingOrders(params);
    }

    createBigBagSendingOrder(params: ICreateBigBagSendingOrderParamsEntity): Observable<IEmptyResponse> {
        return this.datasource.createBigBagSendingOrder(params);
    }
    
}