import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap, withLatestFrom } from "rxjs";
import { getFormFieldsAction, getFormFieldsSuccessAction } from "@/store/actions/admin/suppliers/suppliers.actions";
import { SuppliersUseCase } from "@/domain/use-cases/admin/suppliers/suppliers.usecase";
import { LoadingService } from "@/shared/services/loading.service";
import { Store } from "@ngrx/store";
import { selectActiveCompany } from "@/store/selectors/auth.selectors";

@Injectable({
    providedIn: 'root',
    deps: [Actions, SuppliersUseCase]
})
export class GetFormFieldsEffect {  
    private actions$ = inject(Actions);
    private suppliersUseCase = inject(SuppliersUseCase);
    private loadingService = inject(LoadingService);
    private store = inject(Store);

    getFormFields$ = createEffect(() => this.actions$.pipe(
        ofType(getFormFieldsAction),
        tap(() => {
            this.loadingService.startLoading('general');
        }),
        withLatestFrom(this.store.select(selectActiveCompany)),
        switchMap(([action, activeCompany]) => {
            return this.suppliersUseCase.getFormFields().pipe(
                tap(response => {
                    this.loadingService.stopLoading('general');
                }),
                map(response => getFormFieldsSuccessAction({ payload: response.data }))
            );
        })
    ));
}