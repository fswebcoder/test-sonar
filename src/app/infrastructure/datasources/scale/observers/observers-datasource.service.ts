import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseHttpService } from "@/core/providers/base-http.service";
import { buildHttpParams } from "@/core/utils/build-http-params";
import { IGeneralResponse, TPaginationParams } from "@SV-Development/utilities";
import { IListObserversResponseEntity } from "@/domain/entities/scale/observers/list-observers-response.entity";
import { ICreateObserverParamsEntity } from "@/domain/entities/scale/observers/create-observer-params.entity";
import { IUpdateObserverParamsEntity } from "@/domain/entities/scale/observers/update-observer-params.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ObserversRepository } from "@/domain/repositories/scale/observers/observers.repository";
import { ENVIRONMENT } from "src/app.config";
import { IObserverEntity } from "@/domain/entities/scale/observers/observer.entity";

@Injectable({
  providedIn: "root"
})
export class ObserversDatasourceService extends BaseHttpService<undefined> implements ObserversRepository {
  private readonly env = inject(ENVIRONMENT);
  protected baseUrl = `${this.env.services.security}veedors/`;

  create(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
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

  createObserverForSupplier(data: ICreateObserverParamsEntity): Observable<IEmptyResponse> {
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

    return this.post<IEmptyResponse>(formData, '');
  }

  getAll(params: TPaginationParams): Observable<IListObserversResponseEntity> {
    return this.get<IListObserversResponseEntity>("", { params: buildHttpParams(params) });
  }

  update(params: IUpdateObserverParamsEntity): Observable<IEmptyResponse> {
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

  getByDocumentNumber(documentNumber: string): Observable<IGeneralResponse<IObserverEntity | null>> {
    return this.get<IGeneralResponse<IObserverEntity | null>>(`find-by-document/${documentNumber}`);
  }
}
