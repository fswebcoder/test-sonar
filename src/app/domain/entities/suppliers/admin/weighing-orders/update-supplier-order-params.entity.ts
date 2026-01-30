export interface IUpdateSupplierOrderParamsEntity {
  id: string;
  vehicleId?: string;
  driverId?: string;
  mineId?: string;
  supplierBatchName?: string | null;
  materialTypeId?: string;
  sendedWeight?: number;
  veedorId?: string;
  estimatedShippingDateTime?: Date;
  internalRemissionDocument?: File;
}
