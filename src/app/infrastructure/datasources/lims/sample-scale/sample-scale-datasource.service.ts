import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpParams } from '@/core/utils/build-http-params';
import { IReadScaleResponseEntity } from '@/domain/entities/lims/sample-scale/read-scale-response.entity';
import { ISampleScaleParamsEntity } from '@/domain/entities/lims/sample-scale/sample-scale-params.entity';
import { SampleScaleRepository } from '@/domain/repositories/lims/sample-scale/sample-scale.repository';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class SampleScaleDatasourceService extends BaseHttpService<unknown> implements SampleScaleRepository {
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}`;

   readWeight(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<false>> {
    return this.get<IReadScaleResponseEntity<false>>('scale/weight', {
        params: buildHttpParams(params)
    });
  }

    readTare(params: ISampleScaleParamsEntity): Observable<IReadScaleResponseEntity<true>> {
    return this.get<IReadScaleResponseEntity<true>>('scale/tare', {
        params: buildHttpParams(params)
    });
  }
}