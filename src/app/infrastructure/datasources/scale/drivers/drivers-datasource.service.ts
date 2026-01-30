import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListDriversResponseEntity } from "@/domain/entities/scale/drivers/list-drivers-response.entity";
import { ICreateDriverParamsEntity } from "@/domain/entities/scale/drivers/create-driver-params.entity";
import { IUpdateDriverParamsEntity } from "@/domain/entities/scale/drivers/update-driver-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { DriversRepository } from "@/domain/repositories/scale/drivers/drivers.repository";
import { ENVIRONMENT } from "src/app.config";
import { IDriverEntity } from "@/domain/entities/scale/drivers/driver.entity";

@Injectable({
  providedIn: "root"
})
export class DriversDatasourceService extends BaseHttpService<undefined> implements DriversRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}drivers/`;

  create(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('documentNumber', data.documentNumber);
    formData.append('documentTypeId', data.documentTypeId);

    if (data.cc instanceof File) {
      formData.append('cc', data.cc);
    }

    if (data.arl instanceof File) {
      formData.append('arl', data.arl);
    }

    return this.post<IEmptyResponse>(formData);
  }

  createDriverForSupplier(data: ICreateDriverParamsEntity): Observable<IEmptyResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('documentNumber', data.documentNumber);
    formData.append('documentTypeId', data.documentTypeId);

    if (data.cc instanceof File) {
      formData.append('cc', data.cc);
    }

    if (data.arl instanceof File) {
      formData.append('arl', data.arl);
    }

    return this.post<IEmptyResponse>(formData, 'create-driver-supplier');
  }

  getAll(params: TPaginationParams): Observable<IListDriversResponseEntity> {
    return this.get<IListDriversResponseEntity>("", { params: buildHttpParams(params) });
  }

  update(params: IUpdateDriverParamsEntity): Observable<IEmptyResponse> {
    const { id, documents, ...payload } = params;
    const cc = documents?.cc;
    const arl = documents?.arl;

    const hasFiles = cc instanceof File || arl instanceof File;
    if (!hasFiles) {
      return this.patch<IEmptyResponse>(payload, `${id}`);
    }

    const formData = new FormData();
    if (payload.name !== undefined) formData.append('name', String(payload.name));
    if (payload.documentNumber !== undefined) formData.append('documentNumber', String(payload.documentNumber));
    if (cc instanceof File) formData.append('cc', cc);
    if (arl instanceof File) formData.append('arl', arl);

    return this.patch<IEmptyResponse>(formData, `${id}`);
  }

  desactivate(id: string): Observable<IEmptyResponse> {
    return this.delete<IEmptyResponse>(`${id}`);
  }

  activate(id: string): Observable<IEmptyResponse> {
    return this.patch<IEmptyResponse>(undefined, `activate/${id}`);
  }

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IDriverEntity | null>> {
    return this.get<IGeneralResponse<IDriverEntity | null>>(`find-by-document/${documentNumber}`);
  }
}
