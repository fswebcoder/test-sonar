import { createAction, props } from '@ngrx/store';
import { StoreState } from '../../store.state';

export const HYDRATE = createAction('[Hydratation] Hydrate');

export const HYDRATE_SUCCESS = createAction(
    '[Hydratation] Hydrate Success',
    props<{ state: Partial<StoreState> }>()
);

export const HYDRATE_FAILURE = createAction(
    '[Hydratation] Hydrate Failure',
    props<{ error: any }>()
);

export function isHydrateSuccess(action: any): action is ReturnType<typeof HYDRATE_SUCCESS> {
    return action.type === HYDRATE_SUCCESS.type;
}
