import { RolesRepository } from "@/domain/repositories/admin/roles/roles.repository";
import { RolesRepositoryImp } from "@/infrastructure/repositories/admin/roles/roles.repository-imp";
import { Provider } from "@angular/core";

export function rolesProvider():Provider[]{
    return [
        {
            provide: RolesRepository,
            useClass: RolesRepositoryImp,
        }
    ]
}