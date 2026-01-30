import { CatalogsRepository } from '@/domain/repositories/common/catalogs.repository';
import { CatalogsDatasourceService } from '@/infrastructure/datasources/common/catalogs.datasource.service';
import { CATALOG_ENTITIES_KEYS, CATALOG_ENTITIES } from '@/shared/interfaces/catalogs.type';
import { inject } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';

export class CatalogsRepositoryImp implements CatalogsRepository {
  private readonly catalogsDatasourceService = inject(CatalogsDatasourceService);
  getCatalogs<T extends CATALOG_ENTITIES_KEYS>(catalog: T): Observable<IGeneralResponse<CATALOG_ENTITIES[T][]>> {
    return this.catalogsDatasourceService.getCatalogs(catalog);
  }
}
