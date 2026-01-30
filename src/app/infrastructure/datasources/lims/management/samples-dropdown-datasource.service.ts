import { BaseHttpService } from '@/core/providers/base-http.service';
import { buildHttpParams } from '@/core/utils/build-http-params';
import { ISamplesDropdownEntity } from '@/domain/entities/lims/management/samples-dropdown.entity';
import { SamplesDropdownRepository } from '@/domain/repositories/lims/management/samples-dropdown.repository';
import { IParamsDate } from '@/shared/interfaces/params-date.interface';
import { inject, Injectable } from '@angular/core';
import { IGeneralResponse } from '@SV-Development/utilities';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class SamplesDropdownDatasourceService
  extends BaseHttpService<SamplesDropdownRepository>
  implements SamplesDropdownRepository
{
  private env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}sample-management/`;

  getAll(params: IParamsDate): Observable<IGeneralResponse<ISamplesDropdownEntity>> {
    return this.get<IGeneralResponse<ISamplesDropdownEntity>>(`dropdown-data/`, {
      params: buildHttpParams(params)
    });
  }
}
