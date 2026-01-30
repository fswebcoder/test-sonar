import { IRetallaParamsEntity } from "@/domain/entities/lims/analysis/retalla/retalla-params.entity";
import { RetallaRepository } from "@/domain/repositories/lims/analysis/retalla.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RetallaUseCase implements RetallaRepository{
  private readonly retallaRepository = inject(RetallaRepository);

  create(retallaParams: IRetallaParamsEntity): Observable<IEmptyResponse> {
    return this.retallaRepository.create(retallaParams);
  }
}