import { PendingReceptionsRepository } from "@/domain/repositories/lims/receptions/pending-receptions/pending-receptions.repository";
import { PendingReceptionsRepositoryImp } from "@/infrastructure/repositories/lims/receptions/pending-receptions.repository-imp";
import { Provider } from "@angular/core";

export default function pendingReceptionsProvider():Provider[] {
    return [
        {
            provide: PendingReceptionsRepository,
            useClass: PendingReceptionsRepositoryImp,
        }
    ];
}