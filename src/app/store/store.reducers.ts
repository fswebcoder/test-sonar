import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { StoreState } from "./store.state";
import { routerReducer } from "@ngrx/router-store";
import { authReducer } from "./reducers/auth/auth.reducer";
import { HYDRATATION_META_REDUCER } from "./hydratation/reducers/hydratation.reducer";
import { commonReducer } from "./reducers/common/common.reducer";
import { suppliersReducer } from "./reducers/admin/suppliers/suppliers.reducers";

export const STORE_REDUCERS: ActionReducerMap<StoreState> = {
    router: routerReducer,
    auth: authReducer,
    common: commonReducer,
    suppliers: suppliersReducer
}

export const META_REDUCERS: MetaReducer[] = [HYDRATATION_META_REDUCER];
