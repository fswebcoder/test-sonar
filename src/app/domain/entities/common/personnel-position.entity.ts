import { IIdName } from "@/shared/interfaces/id-name.interface";

export default interface IPersonnelPosition extends IIdName {
  description: string;
  operationAreaId: string;
}
