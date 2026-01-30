import { BaseHttpService } from "@/core/providers/base-http.service";
import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { WeightRegisterRepository } from "@/domain/repositories/scale/weight-register/weight-register.repository";
import { SocketModuleUsecase } from "@/domain/use-cases/socket-module/socket-module.usecase";
import { IWeightReadingEntity } from "@/domain/entities/scale/weight-register/weight-reading.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ICaptureImageResponse } from "@/domain/entities/scale/weight-register/capture-image-response.entity";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ENVIRONMENT } from "src/app.config";

@Injectable({
  providedIn: "root"
})
export class WeightRegisterDatasourceService extends BaseHttpService<unknown> implements WeightRegisterRepository {
  private readonly env = inject(ENVIRONMENT);
  private readonly socketModuleUsecase = inject(SocketModuleUsecase);
  private readonly scaleSocketNamespace = "/scale";
  protected baseUrl = `${this.env.services.security}weight-register/`;

  movementWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
    const { id, weight } = data;
    return this.post<IEmptyResponse>(
      {
        weight,
        imageUrl: data.imageUrl ?? null,
        imageTmpPath: data.imageTmpPath ?? null,
      },
      `mineral-movement/${id}`
    );
  }

  receptionWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
    const { id, weight, destinationStorageZoneId } = data;
    return this.post<IEmptyResponse>(
      {
        weight,
        destinationStorageZoneId,
        imageUrl: data.imageUrl ?? null,
        imageTmpPath: data.imageTmpPath ?? null,
      },
      `mineral-reception/${id}`
    );
  }

  connectToScaleSocket(): void {
    this.socketModuleUsecase.connect(this.scaleSocketNamespace);
  }

  startScale(): void {
    this.socketModuleUsecase.emit("start-scale", undefined);
  }

  stopScale(): void {
    this.socketModuleUsecase.emit("stop-scale", undefined);
  }

  listenWeight(): Observable<IWeightReadingEntity> {
    return this.socketModuleUsecase.listen<IWeightReadingEntity>("weight");
  }

  disconnectScaleSocket(): void {
    this.socketModuleUsecase.disconnect();
  }

  captureImage(): Observable<ICaptureImageResponse> {
    return this.post<ICaptureImageResponse>({}, "capture-image");
  }
}
