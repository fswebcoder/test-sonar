import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";

export interface SuppliersState {
    idSupplier?: string;
    formFields: IFormFieldCreateSupplierEntity[];
    loading: boolean;
    error: any;
}


export const initialSuppliersState: SuppliersState = {
    formFields: [],
    loading: false,
    error: null,
    idSupplier: ''
}

