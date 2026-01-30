export interface IFormFieldCreateSupplierEntity {
    id: string;
    name: string;
    label: string;
    type: TField;
    required: boolean;
    description?: string;
    options?: IFormFieldOption[];
    value?: any;
}

export interface IFormFieldOption {
    id: string;
    name: string;
    code: string;
}

export type TField = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
