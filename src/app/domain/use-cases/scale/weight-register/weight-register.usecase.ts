import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { IWeightReadingEntity } from "@/domain/entities/scale/weight-register/weight-reading.entity";
import { WeightRegisterRepository } from "@/domain/repositories/scale/weight-register/weight-register.repository";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { ICaptureImageResponse } from "@/domain/entities/scale/weight-register/capture-image-response.entity";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class WeightRegisterUsecase implements WeightRegisterRepository {
    private readonly weightRegisterRepository: WeightRegisterRepository = inject(WeightRegisterRepository);
    
    movementWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
        return this.weightRegisterRepository.movementWeight(data);
    }

    receptionWeight(data: IWeightRegisterParams): Observable<IEmptyResponse> {
        return this.weightRegisterRepository.receptionWeight(data);
    }

    connectToScaleSocket(): void {
        return this.weightRegisterRepository.connectToScaleSocket();
    }

    startScale(): void {
        return this.weightRegisterRepository.startScale();
    }

    stopScale(): void {
        return this.weightRegisterRepository.stopScale();
    }

    listenWeight(): Observable<IWeightReadingEntity> {
        return this.weightRegisterRepository.listenWeight();
    }

    disconnectScaleSocket(): void {
        return this.weightRegisterRepository.disconnectScaleSocket();
    }

    captureImage(): Observable<ICaptureImageResponse> {
        return this.weightRegisterRepository.captureImage();
    }
}