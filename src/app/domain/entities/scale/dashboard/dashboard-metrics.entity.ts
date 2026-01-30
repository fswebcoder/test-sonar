export interface ISummaryMetricsEntity {
  totalRecords: number;
  totalNetWeight: number;
  averageWeighingTime: number;
  pendingRecords: number;
  inProcessRecords: number;
  completedTrips: number;
  cancelledTrips: number;
  receptions: number;
  movements: number;
}


export interface IStatusDistributionEntity {
  status: string;
  count: number;
  totalWeight: number;
  percentage: number;
}


export interface ISupplierMetricsEntity {
  supplierId: string;
  supplierName: string;
  totalTrips: number;
  totalNetWeight: number;
  averageWeight: number;
  lastTrip?: Date;
}


export interface IMaterialTypeMetricsEntity {
  materialTypeId: string;
  materialTypeName: string;
  totalTrips: number;
  totalNetWeight: number;
  percentageOfTotal: number;
}


export interface IMineMetricsEntity {
  mineId: string;
  mineName: string;
  supplierName: string;
  totalTrips: number;
  totalNetWeight: number;
}


export interface IRecentActivityEntity {
  id: string;
  consecutive: string;
  supplierName: string;
  vehiclePlate: string;
  driverName: string;
  materialType: string;
  status: string;
  netWeight?: number;
  createdAt: Date;
  estimatedShippingDateTime?: Date;
}


export interface IDailyTrendEntity {
  date: Date;
  totalRecords: number;
  totalWeight: number;
  receptions: number;
  movements: number;
}


export interface IHourlyDistributionEntity {
  hour: number;
  count: number;
}


export interface IStorageZoneFlowEntity {
  count: number;
  totalWeight: number;
}

export interface IStorageZoneMetricsEntity {
  zoneId: string;
  zoneName: string;
  asOrigin: IStorageZoneFlowEntity;
  asDestination: IStorageZoneFlowEntity;
}


export interface IUpcomingTripEntity {
  id: string;
  consecutive: string;
  supplier: string;
  estimatedDateTime: Date;
  status: string;
}

export interface IScheduledTripsEntity {
  today: number;
  thisWeek: number;
  delayed: number;
  upcoming: IUpcomingTripEntity[];
}


export interface IStockMovementEntity {
  inputs: number;
  outputs: number;
  netChange: number;
  inputCount: number;
  outputCount: number;
}

export interface ISupplierStockEntity {
  supplierId: string;
  supplierName: string;
  initialStock: number;
  finalStock: number;
  movements: IStockMovementEntity;
}

export interface IZoneStockEntity {
  zoneId: string;
  zoneName: string;
  initialStock: number;
  finalStock: number;
  movements: IStockMovementEntity;
  bySupplier: ISupplierStockEntity[];
}

export interface IStockTotalsEntity {
  initialStock: number;
  finalStock: number;
  movements: IStockMovementEntity;
}

export interface IStockPeriodEntity {
  from: Date;
  to: Date;
}

export interface IStockByLocationEntity {
  period: IStockPeriodEntity;
  zones: IZoneStockEntity[];
  totals: IStockTotalsEntity;
}


export interface IPeriodEntity {
  from: Date;
  to: Date;
}


export interface ILocationFlowEntity {
  originZoneId: string;
  originZoneName: string;
  destinationZoneId: string;
  destinationZoneName: string;
  totalMovements: number;
  totalWeight: number;
}


export interface IMovementScheduledEntity {
  today: number;
  thisWeek: number;
  pending: number;
  inProcess: number;
}


export interface IMovementsSummaryEntity {
  totalMovements: number;
  totalWeightMoved: number;
  averageWeighingTime: number;
  completedMovements: number;
  cancelledMovements: number;
}


export interface IWeighbridgeDashboardEntity {
  period: IPeriodEntity;
  summary: ISummaryMetricsEntity;
  byStatus: IStatusDistributionEntity[];
  byMaterialType: IMaterialTypeMetricsEntity[];
  bySupplier: ISupplierMetricsEntity[];
  byMine: IMineMetricsEntity[];
  byStorageZone: IStorageZoneMetricsEntity[];
  dailyTrends: IDailyTrendEntity[];
  hourlyDistribution: IHourlyDistributionEntity[];
  recentActivity: IRecentActivityEntity[];
  scheduledTrips: IScheduledTripsEntity;
}


export interface IMovementsDashboardEntity {
  period: IPeriodEntity;
  summary: IMovementsSummaryEntity;
  locationFlows: ILocationFlowEntity[];
  byStatus: IStatusDistributionEntity[];
  bySupplier: ISupplierMetricsEntity[];
  byMine: IMineMetricsEntity[];
  byBatch: IBatchMetricsEntity[];
  scheduled: IMovementScheduledEntity;
  recentActivity: IRecentActivityEntity[];
}


export interface IBatchMetricsEntity {
  batchId: string;
  batchCode: string;
  supplierName: string;
  mineName: string;
  materialType: string;
  totalRecords: number;
  totalWeight: number;
}
