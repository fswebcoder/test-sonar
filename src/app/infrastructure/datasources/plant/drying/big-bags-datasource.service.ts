import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
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
import { ENVIRONMENT } from "src/app.config";

@Injectable({
    providedIn: 'root'
})
export class BigBagsDatasourceService extends BaseHttpService<unknown> implements BigBagsRepository {

    private env = inject(ENVIRONMENT);
    protected baseUrl = `${this.env.services.security}drying/`;

    getAll(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.http.get<IListBigBagsResponseEntity>(`${this.baseUrl}list-big-bags`, { params: buildHttpParams(params) });
    }

    fillBigBag(params: IFillBigBagParamsEntity): Observable<IFillBigBagResponseEntity> {
        return this.http.post<IFillBigBagResponseEntity>(`${this.baseUrl}start-filling`, params);
    }

    getAvailableBigBags(params: IListBigBagsParamsEntity): Observable<IListBigBagsResponseEntity> {
        return this.http.get<IListBigBagsResponseEntity>(`${this.baseUrl}big-bag-check`, { params: buildHttpParams(params) });
    }

    getBigBagSendingOrders(params: IListBigBagSendingOrderParamsEntity): Observable<IListBigBagSendingOrderResponseEntity> {
        return this.http.get<IListBigBagSendingOrderResponseEntity>(`${this.baseUrl}list-shipment-orders`, { params: buildHttpParams(params) });
    }

    createBigBagSendingOrder(params: ICreateBigBagSendingOrderParamsEntity): Observable<IEmptyResponse> {
        return this.http.post<IEmptyResponse>(`${this.baseUrl}generate-shipment-order`, params.bigBags);
    }
}