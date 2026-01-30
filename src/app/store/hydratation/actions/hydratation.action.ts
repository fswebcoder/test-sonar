import { createAction, props } from '@ngrx/store';
import { StoreState } from '../../store.state';

export const HYDRATE_SUCCESS = createAction('[Hydration] Hydrate Success', props<{ state: StoreState }>());
