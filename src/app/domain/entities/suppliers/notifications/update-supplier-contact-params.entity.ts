import { ISupplierContactEntity } from "./supplier-contact.entity";

export interface IUpdateSupplierContactParamsEntity
  extends Partial<Pick<ISupplierContactEntity, "email" | "name" | "position" | "phone">>,
    Pick<ISupplierContactEntity, "id"> {}
