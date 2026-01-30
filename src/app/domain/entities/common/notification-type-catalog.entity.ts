export interface INotificationTypeCatalogEntity {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}
