import { createAction, props } from "@ngrx/store";
import { IFormFieldCreateSupplierEntity } from "@/domain/entities/admin/suppliers/form-field-create-supplier.entity";

export const GET_FORM_FIELDS = '[Suppliers] Get Form Fields';
export const GET_FORM_FIELDS_SUCCESS = '[Suppliers] Get Form Fields Success';
export const GET_FORM_FIELDS_FAILURE = '[Suppliers] Get Form Fields Failure';
export const CLEAR_FORM_FIELDS = '[Suppliers] Clear Form Fields';

export const ID_SUPPLIER = '[Suppliers] Id Supplier';

export const getFormFieldsAction = createAction(GET_FORM_FIELDS);
export const getFormFieldsSuccessAction = createAction(GET_FORM_FIELDS_SUCCESS, props<{ payload: IFormFieldCreateSupplierEntity[] }>());
export const getFormFieldsFailureAction = createAction(GET_FORM_FIELDS_FAILURE, props<{ error: any }>());
export const clearFormFieldsAction = createAction(CLEAR_FORM_FIELDS);
export const idSupplierAction = createAction(ID_SUPPLIER, props<{ payload: string }>());

