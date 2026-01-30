import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { IWeightReadingEntity } from "@/domain/entities/scale/weight-register/weight-reading.entity";
import { ICaptureImageResponse } from "@/domain/entities/scale/weight-register/capture-image-response.entity";
import { WeightRegisterRepository } from "@/domain/repositories/scale/weight-register/weight-register.repository";
import { WeightRegisterDatasourceService } from "@/infrastructure/datasources/scale/weight-register/weight-register-datasource.service";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class WeightRegisterRepositoryImp implements WeightRegisterRepository {
    private readonly weightRegisterDatasourceService: WeightRegisterDatasourceService = inject(WeightRegisterDatasourceService);
    movementWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
        return this.weightRegisterDatasourceService.movementWeight(data);
    }
    receptionWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
        return this.weightRegisterDatasourceService.receptionWeight(data);
    }
    connectToScaleSocket(): void {
        return this.weightRegisterDatasourceService.connectToScaleSocket();
    }
    startScale(): void {
        return this.weightRegisterDatasourceService.startScale();
    }
    stopScale(): void {
        return this.weightRegisterDatasourceService.stopScale();
    }
    listenWeight(): Observable<IWeightReadingEntity> {
        return this.weightRegisterDatasourceService.listenWeight();
    }
    disconnectScaleSocket(): void {
        return this.weightRegisterDatasourceService.disconnectScaleSocket();
    }

    captureImage(): Observable<ICaptureImageResponse> {
        return this.weightRegisterDatasourceService.captureImage();
    }
}