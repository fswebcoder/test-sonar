export interface ICreateWeighingOrderParams {
    driverId: string;
    materialTypeId: string;
    sendedWeight: number;
    vehicleId: string;
    estimatedShippingDateTime: Date;
    mineId?: string;
    supplierBatchName?: string | null;
    veedorId?: string;
    internalRemissionDocument?: File | null;
}
