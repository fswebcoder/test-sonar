import { CATALOG_ENTITIES, CATALOG_ENTITIES_KEYS } from '@/shared/interfaces/catalogs.type';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

export abstract class CatalogsRepository {
  abstract getCatalogs<T extends CATALOG_ENTITIES_KEYS>(
    catalog: T
  ): Observable<IGeneralResponse<CATALOG_ENTITIES[T][]>>;
}
