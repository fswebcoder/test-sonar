import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpFormData } from '@/core/utils/build-http-form-data';
import { IXrfParamsEntity } from '@/domain/entities/lims/analysis/xrf/xrf-params.entity';
import { IXrfResponseEntity } from '@/domain/entities/lims/analysis/xrf/xrf-response';
import { XrfRepository } from '@/domain/repositories/lims/analysis/xrf.repository';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class XrfDatasourceService extends BaseHttpService<IXrfResponseEntity> implements XrfRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}analysis/`;

  create(params: IXrfParamsEntity): Observable<IXrfResponseEntity> {
    const formData = buildHttpFormData(params);
    return this.post<IXrfResponseEntity>(formData, 'xrf');
  }
}
