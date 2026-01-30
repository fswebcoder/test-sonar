import { IIdName } from '@/shared/interfaces/id-name.interface';

export interface IActionEntity extends IIdName {
  description: string;
  dependsOnId: string | null;
  resource: {
    description: string | null;
    parent: IIdName;
    application: IIdName;
  } & IIdName;
}
