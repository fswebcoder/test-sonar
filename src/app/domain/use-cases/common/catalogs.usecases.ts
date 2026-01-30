import { inject, Injectable } from '@angular/core';
import { CatalogsRepository } from '@/domain/repositories/common/catalogs.repository';
import { CATALOG_ENTITIES, CATALOG_ENTITIES_KEYS } from '@/shared/interfaces/catalogs.type';
import { Observable } from 'rxjs';
import { IGeneralResponse } from '@SV-Development/utilities';

@Injectable({
  providedIn: 'root'
})
export class CatalogsUseCases {
  private readonly catalogsRepository = inject(CatalogsRepository);

  execute<T extends CATALOG_ENTITIES_KEYS>(catalog: T): Observable<IGeneralResponse<CATALOG_ENTITIES[T][]>> {
    return this.catalogsRepository.getCatalogs(catalog);
  }
}
