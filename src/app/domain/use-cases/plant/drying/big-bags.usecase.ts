import { ICreateBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/create-big-bag-sending-order-params.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";
import { IFillBigBagResponseEntity } from "@/domain/entities/plant/drying/fill-big-bag-response.entity";
import { IListBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity";
import { IListBigBagSendingOrderResponseEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-response.entity";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";
import { IListBigBagsResponseEntity } from "@/domain/entities/plant/drying/list-big-bags-response.entity";
import { BigBagsRepository } from "@/domain/repositories/plant/drying/big-bags.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BigBagsUsecase implements BigBagsRepository {
    private readonly repository: BigBagsRepository = inject(BigBagsRepository);

    getAll(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.repository.getAll(params);
    }

    fillBigBag(params: IFillBigBagParamsEntity): Observable<IFillBigBagResponseEntity> {
        return this.repository.fillBigBag(params);
    }

    getAvailableBigBags(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.repository.getAvailableBigBags(params);
    }

    getBigBagSendingOrders(params: IListBigBagSendingOrderParamsEntity): Observable<IListBigBagSendingOrderResponseEntity> {
        return this.repository.getBigBagSendingOrders(params);
    }

    createBigBagSendingOrder(params: ICreateBigBagSendingOrderParamsEntity): Observable<IEmptyResponse> {
        return this.repository.createBigBagSendingOrder(params);
    }

}