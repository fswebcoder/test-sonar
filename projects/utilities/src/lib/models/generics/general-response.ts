export interface IGeneralResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  path: string;
  timestamp: Date;
  traceId?: string;
}
