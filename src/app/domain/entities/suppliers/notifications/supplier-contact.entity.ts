export interface ISupplierContactEntity {
  id: string;
  supplierId: string;
  email: string;
  name: string;
  position?: string | null;
  phone?: string | null;
  isActive: boolean;
}
