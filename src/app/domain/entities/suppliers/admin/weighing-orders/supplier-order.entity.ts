import { IIdName } from '@/shared/interfaces/id-name.interface';

export interface ISupplierOrderVehicle {
  id: string;
  plate: string;
}

export interface ISupplierOrderDriver extends IIdName {
  documentNumber: string;
}

export interface ISupplierOrderEntity {
  id: string;
  consecutive: string;
  status: string;
  vehicle: ISupplierOrderVehicle;
  driver: ISupplierOrderDriver;
  materialType: IIdName;
  mine?: IIdName | null;
  supplierBatchName?: string | null;
  sendedWeight?: string | null;
  estimatedShippingDateTime: Date | string;
  veedor?: IIdName | null;
}
