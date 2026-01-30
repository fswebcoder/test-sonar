import { EOrderScaleType } from "@/shared/enums/order-scale-type.enum";

export interface IDashboardFiltersEntity {
  startDate: Date;
  endDate: Date;
  supplierId?: string;
  mineId?: string;
  materialTypeId?: string;
  vehicleId?: string;
  driverId?: string;
  destinationStorageZoneId?: string;
  originStorageZoneId?: string;
  operationType?: EOrderScaleType;
}

export interface IStockByLocationFiltersEntity {
  startDate: Date;
  endDate: Date;
  supplierId?: string;
  operationType?: EOrderScaleType;
}
