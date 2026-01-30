import { IBigBagEntity } from "@/domain/entities/plant/drying/big-bag.entity";
import { ICreateBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/create-big-bag-sending-order-params.entity";
import { IFillBigBagParamsEntity } from "@/domain/entities/plant/drying/fill-big-bag-params.entity";
import { IFillBigBagResponseEntity } from "@/domain/entities/plant/drying/fill-big-bag-response.entity";
import { IListBigBagsResponseEntity } from "@/domain/entities/plant/drying/list-big-bags-response.entity";
import { IGetAll } from "@/shared/interfaces/get-all.interface";
import { IListBigBagsParamsEntity } from "@/domain/entities/plant/drying/list-big-bags-params.entity";
import { Observable } from "rxjs";
import { IListBigBagSendingOrderParamsEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-params.entity";
import { IListBigBagSendingOrderResponseEntity } from "@/domain/entities/plant/drying/list-big-bag-sending-order-response.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";

export abstract class BigBagsRepository implements IGetAll<IBigBagEntity, true>{
    abstract getAll(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity>
    abstract fillBigBag(params:IFillBigBagParamsEntity): Observable<IFillBigBagResponseEntity>
    abstract getAvailableBigBags(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity>
    abstract getBigBagSendingOrders(params: IListBigBagSendingOrderParamsEntity): Observable<IListBigBagSendingOrderResponseEntity>
    abstract createBigBagSendingOrder(params: ICreateBigBagSendingOrderParamsEntity): Observable<IEmptyResponse>
}
