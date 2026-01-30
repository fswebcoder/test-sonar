import { GenericResponseType } from '@/shared/types/generic-response.type';

export interface IsupplierListResponseEntity extends Omit<GenericResponseType, 'code'> {
  documentTypeId: string;
  documentNumber: string;
  shortName: string;
}
