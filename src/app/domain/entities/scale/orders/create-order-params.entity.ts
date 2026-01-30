import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";

export interface ICreateOrderParamsEntity {
    destinationStorageZoneId?: string;
    driverId: string;
    materialTypeId: string;
    mineId?: string;
    operationTypeWeightRegister: EOrderScaleType;
    supplierId: string;
    vehicleId: string;
    batchId?: string | null;
    batchName?: string | null;
    originStorageZoneId?: string;
    estimatedShippingDateTime?: Date | null;
    internalRemissionDocument?: File | null;
}
