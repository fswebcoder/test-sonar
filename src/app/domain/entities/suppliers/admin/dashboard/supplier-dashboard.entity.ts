export enum ChartGroupBy {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export interface ISupplierDashboardQuery {
  startDate?: Date;
  endDate?: Date;
  groupBy?: ChartGroupBy;
}

export interface IOrdersByStatus {
  CREADO: number;
  PENDIENTE: number;
  PROCESO: number;
  COMPLETADO: number;
  CANCELADO: number;
}

export interface ISummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface IWeightMetrics {
  totalDelivered: number;
  totalSent: number;
  averagePerDelivery: number;
}

export interface IActivityMetrics {
  ordersThisMonth: number;
  completedThisMonth: number;
  lastDeliveryDate: Date | null;
}

export interface IChartDataPoint {
  label: string;
  weight: number;
  deliveries: number;
}

export interface ISupplierDashboardResponse {
  summary: ISummary;
  ordersByStatus: IOrdersByStatus;
  weight: IWeightMetrics;
  activity: IActivityMetrics;
  chart: IChartDataPoint[];
}
