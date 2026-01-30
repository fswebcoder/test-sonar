import { RouterState } from "@angular/router";
import { AuthState } from "./models/auth/auth.model";
import { CommonState } from "./models/common/common.model";
import { SuppliersState } from "./models/admin/suppliers/suppliers.model";


export interface StoreState {
    router: RouterState;
    auth: AuthState;
    common: CommonState;
    suppliers: SuppliersState;
    
  }
