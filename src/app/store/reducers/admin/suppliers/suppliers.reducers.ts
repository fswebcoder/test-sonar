import { createReducer, on } from "@ngrx/store";
import { initialSuppliersState } from "@/store/models/admin/suppliers/suppliers.model";
import { getFormFieldsAction, getFormFieldsFailureAction, getFormFieldsSuccessAction, clearFormFieldsAction, idSupplierAction } from "@/store/actions/admin/suppliers/suppliers.actions";

export const suppliersReducer = createReducer(
    initialSuppliersState,
    on(getFormFieldsSuccessAction, (state, { payload }) => {
        return { ...state, formFields: payload, loading: false };
    }),
    on(getFormFieldsFailureAction, (state, { error }) => {
        return { ...state, error, loading: false };
    }),
    on(getFormFieldsAction, (state) => {
        return { ...state, loading: true };
    }),
    on(clearFormFieldsAction, (state) => {
        return { ...state, formFields: [], loading: false };
    }),
    on(idSupplierAction, (state, { payload }) => {
        return { ...state, idSupplier: payload };
    })
)