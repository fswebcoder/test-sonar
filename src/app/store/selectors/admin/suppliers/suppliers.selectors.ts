import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SuppliersState } from "@/store/models/admin/suppliers/suppliers.model";

export const selectSuppliersState = createFeatureSelector<SuppliersState>('suppliers');

export const selectFormFields = createSelector(
    selectSuppliersState,
    (state: SuppliersState) => state.formFields
);

export const selectFormFieldsLoading = createSelector( 
    selectSuppliersState,
    (state: SuppliersState) => state.loading
);

export const selectFormFieldsError = createSelector(
    selectSuppliersState,
    (state: SuppliersState) => state.error
)

export const selectIdSupplier = createSelector(
    selectSuppliersState,
    (state: SuppliersState) => state
)   