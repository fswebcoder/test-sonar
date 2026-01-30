import { BaseHttpService } from '@/core/providers/base-http.service';
import { CatalogsRepository } from '@/domain/repositories/common/catalogs.repository';
import { CATALOG_ENTITIES_KEYS, CATALOG_ENTITIES } from '@/shared/interfaces/catalogs.type';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class CatalogsDatasourceService<T extends CATALOG_ENTITIES_KEYS>
  extends BaseHttpService<CATALOG_ENTITIES[T]>
  implements CatalogsRepository
{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}common/catalogs/`;

  getCatalogs<T extends CATALOG_ENTITIES_KEYS>(catalog: T): Observable<IGeneralResponse<CATALOG_ENTITIES[T][]>> {
    return this.get<IGeneralResponse<CATALOG_ENTITIES[T][]>>(`${catalog}`);
  }
}
