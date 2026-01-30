import { IWeightRegisterParams } from "@/domain/entities/scale/weight-register/weight-register-params.entity";
import { IWeightReadingEntity } from "@/domain/entities/scale/weight-register/weight-reading.entity";
import { IEmptyResponse } from "@/shared/interfaces/empty-response.interface";
import { Observable } from "rxjs";
import { ICaptureImageResponse } from "@/domain/entities/scale/weight-register/capture-image-response.entity";

export abstract class WeightRegisterRepository {
    abstract movementWeight(data: IWeightRegisterParams): Observable<IEmptyResponse>;
    abstract receptionWeight(data: IWeightRegisterParams): Observable<IEmptyResponse>;
    abstract connectToScaleSocket(): void;
    abstract startScale(): void;
    abstract stopScale(): void;
    abstract listenWeight(): Observable<IWeightReadingEntity>;
    abstract disconnectScaleSocket(): void;
    abstract captureImage():Observable<ICaptureImageResponse>
}