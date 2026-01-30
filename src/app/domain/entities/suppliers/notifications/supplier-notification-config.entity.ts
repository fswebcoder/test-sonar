import { INotificationTypeEntity } from "./notification-type.entity";
import { ISupplierContactEntity } from "./supplier-contact.entity";

export interface ISupplierNotificationConfigEntity {
  id: string;
  notificationTypeId: string;
  supplierContactId: string;
  isActive: boolean;
  notificationType?: Pick<INotificationTypeEntity, "id" | "code" | "name" | "description">;
  supplierContact?: Pick<ISupplierContactEntity, "id" | "name" | "email">;
}
