import { IAtomicAbsorptionResponseEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-response.entity';
import { AtomicAbsorptionRepository } from '@/domain/repositories/lims/analysis/atomic-absorption.repository';
import { IAtomicAbsorptionParamsEntity } from '@/domain/entities/lims/analysis/atomic-absorption/atomic-absorption-params.entity';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGeneralResponse } from '@SV-Development/utilities';
import { ENVIRONMENT } from 'src/app.config';
import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpFormData } from '@/core/utils/build-http-form-data';

@Injectable({
  providedIn: 'root'
})
export class AtomicAbsorptionService
  extends BaseHttpService<IAtomicAbsorptionResponseEntity>
  implements AtomicAbsorptionRepository
{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}analyses/`;

    create(args: IAtomicAbsorptionParamsEntity): Observable<IGeneralResponse<IAtomicAbsorptionResponseEntity>> {
      const formData = buildHttpFormData(args);

    return this.post<IGeneralResponse<IAtomicAbsorptionResponseEntity>>(formData, 'aa-analyses');
  }
}
