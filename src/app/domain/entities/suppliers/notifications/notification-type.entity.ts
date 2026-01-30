export interface INotificationTypeEntity {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}
